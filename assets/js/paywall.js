/* ============================================================
   ChinaEase — Paywall (lightweight, manual fulfilment)
   - Items are locked until a redeem code (issued after payment)
     is entered. Unlock state is stored in localStorage so it
     persists on the visitor's device.
   - NOTE: this is a front-end gate for a no-backend static site.
     It discourages casual access but is NOT cryptographically
     secure. Real per-order security needs a backend + payment
     verification (see discussion with site owner).
   ============================================================ */
(function () {
  "use strict";

  var UNLOCK_KEY = "chinaease_unlocked";

  // Admin: replace / extend this map. Each code unlocks a list of item ids.
  // Issue a unique code per paid order for basic control.
  var REDEEM = {
    HSK2026: ["hsk1", "hsk2"] // demo code — unlocks all sample items
  };

  // Item id -> PDF file path (used for preview + download)
  var FILES = {
    hsk1: "assets/pdf/hsk1-sample.pdf",
    hsk2: "assets/pdf/hsk2-sample.pdf"
  };

  function getUnlocked() {
    try {
      var v = JSON.parse(localStorage.getItem(UNLOCK_KEY) || "[]");
      return Array.isArray(v) ? v : [];
    } catch (e) {
      return [];
    }
  }
  function saveUnlocked(arr) {
    localStorage.setItem(UNLOCK_KEY, JSON.stringify(arr));
  }

  function render() {
    var unlocked = getUnlocked();
    document.querySelectorAll(".pdf-item.premium").forEach(function (el) {
      var id = el.getAttribute("data-id");
      var ok = unlocked.indexOf(id) !== -1;
      var buy = el.querySelector("[data-buy]");
      var acts = el.querySelector(".pdf-actions");
      if (buy) buy.style.display = ok ? "none" : "";
      if (acts) acts.style.display = ok ? "flex" : "none";
    });
  }

  function openModal() {
    var m = document.getElementById("payModal");
    if (m) m.classList.add("open");
  }
  function closeModal() {
    var m = document.getElementById("payModal");
    if (m) m.classList.remove("open");
  }
  function openLightbox(id) {
    var lb = document.getElementById("pdfLightbox");
    var f = document.getElementById("pdfFrame");
    if (lb && f && FILES[id]) {
      f.src = FILES[id];
      lb.classList.add("open");
    }
  }
  function closeLightbox() {
    var lb = document.getElementById("pdfLightbox");
    var f = document.getElementById("pdfFrame");
    if (lb) lb.classList.remove("open");
    if (f) f.src = "";
  }

  function showOk(msg, isError) {
    var ok = document.getElementById("redeemOk");
    if (!ok) return;
    ok.textContent = msg;
    ok.style.color = isError ? "#dc2626" : "var(--emerald)";
    ok.classList.add("show");
    setTimeout(function () {
      ok.classList.remove("show");
    }, 2000);
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-buy]")) {
      e.preventDefault();
      openModal();
      return;
    }
    var prev = e.target.closest("[data-preview]");
    if (prev) {
      e.preventDefault();
      openLightbox(prev.getAttribute("data-preview"));
      return;
    }
    if (e.target.closest("[data-close]")) {
      closeModal();
      return;
    }
    if (e.target.id === "payModal") {
      closeModal();
      return;
    }
    if (e.target.closest("[data-lb-close]") || e.target.id === "pdfLightbox") {
      closeLightbox();
      return;
    }
  });

  var redeemBtn = document.getElementById("redeemBtn");
  if (redeemBtn) {
    redeemBtn.addEventListener("click", function () {
      var inp = document.getElementById("redeemInput");
      var code = (inp && inp.value ? inp.value : "").trim().toUpperCase();
      if (!code) {
        showOk(
          document.body.classList.contains("lang-zh")
            ? "请输入兑换码"
            : "Please enter a code",
          true
        );
        return;
      }
      if (REDEEM[code]) {
        var cur = getUnlocked();
        REDEEM[code].forEach(function (id) {
          if (cur.indexOf(id) === -1) cur.push(id);
        });
        saveUnlocked(cur);
        render();
        showOk(
          document.body.classList.contains("lang-zh")
            ? "✓ 已解锁！"
            : "✓ Unlocked!",
          false
        );
        setTimeout(function () {
          closeModal();
          if (inp) inp.value = "";
        }, 1300);
      } else {
        showOk(
          document.body.classList.contains("lang-zh")
            ? "✗ 兑换码无效，请核对"
            : "✗ Invalid code, please check",
          true
        );
      }
    });
  }

  // close lightbox with Esc
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeModal();
      closeLightbox();
    }
  });

  render();
})();
