/* ============================================================
   ChinaEase — Jobs page
   - Renders a curated snapshot of foreigner-friendly roles in China
   - City / Field filtering (bilingual)
   - "Book a service" modal (WeChat / email / phone contact)
   NOTE: listings are a curated snapshot, not a live API feed.
   A live auto-updating feed would require a backend.
   ============================================================ */
(function () {
  "use strict";

  var CAT = {
    teaching:    { en: "Teaching",    zh: "教学" },
    tech:        { en: "Tech / IT",   zh: "科技/IT" },
    marketing:   { en: "Marketing",   zh: "市场" },
    trade:       { en: "Trade / BD",  zh: "贸易/商务" },
    hospitality: { en: "Hospitality", zh: "酒店" }
  };

  // Curated snapshot (Aug 2026) — representative of roles in demand for
  // foreign candidates, sourced from public expat job boards.
  var JOBS = [
    { t: { en: "English Teacher (International School)", zh: "英语教师（国际学校）" },
      co: "Shanghai Baoshan World Foreign Language School", city: "Shanghai", cat: "teaching", salary: "¥22k+/mo", visa: "Z", featured: true },
    { t: { en: "Bilingual Subject Teacher (Math / Physics)", zh: "双语学科教师（数学/物理）" },
      co: "Xi'an Jiao Tong Univ. HS · Int'l Center", city: "Xi'an", cat: "teaching", salary: "Negotiable", visa: "Z" },
    { t: { en: "International School Teacher", zh: "国际学校教师" },
      co: "Suzhou North America Int'l HS", city: "Suzhou", cat: "teaching", salary: "¥10k–16k/mo", visa: "Z" },
    { t: { en: "A-Level / ESL Teacher", zh: "A-Level / 英语教师" },
      co: "Shanghai Int'l Division", city: "Shanghai", cat: "teaching", salary: "¥22k+/mo", visa: "Z" },
    { t: { en: "Software Engineer / AI", zh: "软件工程师 / AI" },
      co: "Beijing · Zhongguancun", city: "Beijing", cat: "tech", salary: "¥25k–50k/mo", visa: "Z / K", featured: true },
    { t: { en: "R&D Scientist (Pharma / Tech)", zh: "研发科学家（医药/科技）" },
      co: "Shanghai / Beijing", city: "Shanghai", cat: "tech", salary: "¥40k+/mo", visa: "Z / R" },
    { t: { en: "Data Scientist / Machine Learning", zh: "数据科学家 / 机器学习" },
      co: "Beijing / Shanghai", city: "Beijing", cat: "tech", salary: "¥30k–60k/mo", visa: "Z / K", featured: true },
    { t: { en: "Marketing / Brand Manager", zh: "市场 / 品牌经理" },
      co: "Shanghai", city: "Shanghai", cat: "marketing", salary: "¥20k–40k/mo", visa: "Z" },
    { t: { en: "International Trade / BD Manager", zh: "国际贸易 / 商务拓展经理" },
      co: "Guangzhou / Shanghai", city: "Guangzhou", cat: "trade", salary: "¥15k–30k/mo", visa: "Z" },
    { t: { en: "University Lecturer (STEM)", zh: "大学讲师（理工科）" },
      co: "Nationwide", city: "Nationwide", cat: "teaching", salary: "¥30k+/mo", visa: "Z" },
    { t: { en: "Hotel / Hospitality Manager", zh: "酒店 / 住宿业经理" },
      co: "Tier-1 City", city: "Shanghai", cat: "hospitality", salary: "¥15k–25k/mo", visa: "Z" },
    { t: { en: "ESL Teacher (Training Center)", zh: "英语教师（培训机构）" },
      co: "Hangzhou", city: "Hangzhou", cat: "teaching", salary: "¥15k–25k/mo + apt", visa: "Z" }
  ];

  function isZh() { return document.body.classList.contains("lang-zh"); }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function render() {
    var grid = document.getElementById("jobGrid");
    if (!grid) return;
    var city = grid.getAttribute("data-city") || "all";
    var cat = grid.getAttribute("data-cat") || "all";
    var zh = isZh();
    var html = "";

    JOBS.forEach(function (j) {
      if (city !== "all" && j.city !== city) return;
      if (cat !== "all" && j.cat !== cat) return;
      var badge = j.featured
        ? '<span class="feat-badge">' + (zh ? "热门" : "HOT") + "</span>"
        : "";
      html +=
        '<div class="job-card' + (j.featured ? " featured" : "") + '">' +
          badge +
          '<h3><span class="en">' + esc(j.t.en) + "</span><span class=\"zh\">" + esc(j.t.zh) + "</span></h3>" +
          '<div class="co">' + esc(j.co) + "</div>" +
          '<div class="job-tags">' +
            "<span>" + esc(j.city) + "</span>" +
            '<span><span class="en">' + esc(CAT[j.cat].en) + '</span><span class="zh">' + esc(CAT[j.cat].zh) + "</span></span>" +
            '<span class="visa">' + (zh ? "签证 " : "") + esc(j.visa) + "</span>" +
            '<span class="salary">' + esc(j.salary) + "</span>" +
          "</div>" +
        "</div>";
    });

    grid.innerHTML = html ||
      '<p class="job-note" style="grid-column:1/-1;text-align:center;">' +
        (zh ? "暂无匹配职位。" : "No matching roles.") + "</p>";
  }

  // Filter chips
  document.querySelectorAll(".chips").forEach(function (group) {
    group.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (!btn) return;
      group.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("on"); });
      btn.classList.add("on");
      var grid = document.getElementById("jobGrid");
      var key = group.getAttribute("data-filter");
      if (grid) grid.setAttribute("data-" + key, btn.getAttribute("data-val"));
      render();
    });
  });

  // Re-render on language switch so badge / empty-state text updates
  document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
    btn.addEventListener("click", function () { setTimeout(render, 0); });
  });

  // Booking modal
  var bookModal = document.getElementById("bookModal");
  function openBook() { if (bookModal) bookModal.classList.add("open"); }
  function closeBook() { if (bookModal) bookModal.classList.remove("open"); }

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-book]");
    if (b) {
      e.preventDefault();
      var p = document.querySelector("[data-book-service]");
      if (p) p.textContent = b.getAttribute("data-book");
      openBook();
      return;
    }
    if (e.target.closest("[data-close]") || e.target.id === "bookModal") closeBook();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeBook();
  });

  render();
})();
