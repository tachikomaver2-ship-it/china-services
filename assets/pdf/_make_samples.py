#!/usr/bin/env python3
# Dev helper: generate placeholder sample PDFs for the paid HSK materials section.
# Run: python3 _make_samples.py  -> writes hsk1-sample.pdf, hsk2-sample.pdf
import os

HERE = os.path.dirname(os.path.abspath(__file__))


def build_pdf(title, lines):
    objs = []

    def add(obj):
        objs.append(obj)
        return len(objs)  # 1-based id

    catalog_id = add(None)
    pages_id = add(None)
    page_ids = []
    content_ids = []
    font_id = add(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")
    font_b_id = add(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>")

    # Build a content stream for one page (text)
    def content_stream(text_lines):
        parts = ["BT", "/F2 22 Tf", "72 760 Td", f"({title}) Tj", "ET"]
        y = 720
        parts.append("BT")
        parts.append("/F1 14 Tf")
        parts.append(f"72 {y} Td")
        for ln in text_lines:
            parts.append(f"({ln}) Tj")
            y -= 22
            parts.append("0 -22 Td")
        parts.append("ET")
        return "\n".join(parts).encode("latin-1", "replace")

    for text_lines in lines:
        cid = add(content_stream(text_lines))
        content_ids.append(cid)
        pid = add(None)
        page_ids.append(pid)

    # fill catalog & pages
    objs[catalog_id - 1] = f"<< /Type /Catalog /Pages {pages_id} 0 R >>".encode()
    kids = " ".join(f"{pid} 0 R" for pid in page_ids)
    objs[pages_id - 1] = f"<< /Type /Pages /Kids [{kids}] /Count {len(page_ids)} >>".encode()
    for i, pid in enumerate(page_ids):
        objs[pid - 1] = (
            f"<< /Type /Page /Parent {pages_id} 0 R /MediaBox [0 0 595 842] "
            f"/Resources << /Font << /F1 {font_id} 0 R /F2 {font_b_id} 0 R >> >> "
            f"/Contents {content_ids[i]} 0 R >>"
        ).encode()

    # Serialize with correct xref offsets
    out = bytearray()
    out += b"%PDF-1.4\n"
    offsets = [0] * (len(objs) + 1)
    for i, body in enumerate(objs, start=1):
        offsets[i] = len(out)
        out += f"{i} 0 obj\n".encode() + body + b"\nendobj\n"

    xref_pos = len(out)
    out += f"xref\n0 {len(objs)+1}\n".encode()
    out += b"0000000000 65535 f \n"
    for i in range(1, len(objs) + 1):
        out += f"{offsets[i]:010d} 00000 n \n".encode()
    out += b"trailer\n"
    out += f"<< /Size {len(objs)+1} /Root {catalog_id} 0 R >>\n".encode()
    out += b"startxref\n"
    out += f"{xref_pos}\n".encode()
    out += b"%%EOF"
    return bytes(out)


samples = {
    "hsk1-sample.pdf": build_pdf(
        "HSK 1 - Sample Material (Preview)",
        [
            "This is a SAMPLE preview page.",
            "Purchase the full PDF to unlock all lessons.",
            "",
            "Lesson 1: Ni hao (Hello)",
            "  - Greetings and self-introduction",
            "  - Tones: ma / ma / ma / ma",
            "",
            "Vocabulary: 150 words (full list in paid version)",
            "(c) ChinaEase - placeholder sample",
        ],
    ),
    "hsk2-sample.pdf": build_pdf(
        "HSK 2 - Sample Material (Preview)",
        [
            "This is a SAMPLE preview page.",
            "Purchase the full PDF to unlock all lessons.",
            "",
            "Lesson 1: Daily Routines",
            "  - Talking about your day",
            "  - Time expressions",
            "",
            "Vocabulary: 300 words (full list in paid version)",
            "(c) ChinaEase - placeholder sample",
        ],
    ),
    "hsk3-sample.pdf": build_pdf(
        "HSK 3 - Sample Material (Preview)",
        [
            "This is a SAMPLE preview page.",
            "Purchase the full PDF to unlock all lessons.",
            "",
            "Lesson 1: Travel & Transportation",
            "  - Booking tickets, asking directions",
            "  - Describing locations and routes",
            "",
            "Vocabulary: 600 words (full list in paid version)",
            "Includes practice tests in full version",
            "(c) ChinaEase - placeholder sample",
        ],
    ),
    "hsk4-sample.pdf": build_pdf(
        "HSK 4 - Sample Material (Preview)",
        [
            "This is a SAMPLE preview page.",
            "Purchase the full PDF to unlock all lessons.",
            "",
            "Lesson 1: Social Interactions",
            "  - Expressing opinions and feelings",
            "  - Discussing current events",
            "",
            "Vocabulary: 1200 words (full list in paid version)",
            "Includes practice tests in full version",
            "(c) ChinaEase - placeholder sample",
        ],
    ),
    "hsk5-sample.pdf": build_pdf(
        "HSK 5 - Sample Material (Preview)",
        [
            "This is a SAMPLE preview page.",
            "Purchase the full PDF to unlock all lessons.",
            "",
            "Lesson 1: Professional Communication",
            "  - Business meetings and negotiations",
            "  - Formal writing and reports",
            "",
            "Vocabulary: 2500 words (full list in paid version)",
            "Includes advanced reading materials",
            "(c) ChinaEase - placeholder sample",
        ],
    ),
    "hsk6-sample.pdf": build_pdf(
        "HSK 6 - Sample Material (Preview)",
        [
            "This is a SAMPLE preview page.",
            "Purchase the full PDF to unlock all lessons.",
            "",
            "Lesson 1: Academic & Abstract Topics",
            "  - Literature, philosophy, economics",
            "  - Complex argumentation structures",
            "",
            "Vocabulary: 5000+ words (full list in paid version)",
            "Includes advanced reading + writing guide",
            "(c) ChinaEase - placeholder sample",
        ],
    ),
}

for name, data in samples.items():
    path = os.path.join(HERE, name)
    with open(path, "wb") as f:
        f.write(data)
    print("wrote", path, len(data), "bytes")
