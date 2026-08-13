/* ============================================================
   China Services — Shared JS
   - Bilingual toggle (EN / 中文) with localStorage persistence
   - Mobile nav
   - Active nav link highlight
   ============================================================ */

(function () {
  "use strict";

  var STORAGE_KEY = "cs_lang";

  function setLang(lang) {
    document.body.classList.remove("lang-en", "lang-zh");
    document.body.classList.add("lang-" + lang);
    document.documentElement.lang = (lang === "zh") ? "zh-CN" : "en";
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    var btns = document.querySelectorAll("[data-lang-btn]");
    btns.forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-lang-btn") === lang);
    });
  }

  function initLang() {
    var saved;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (!saved) {
      // Default to English for foreign visitors
      saved = "en";
    }
    setLang(saved);

    document.querySelectorAll("[data-lang-btn]").forEach(function (b) {
      b.addEventListener("click", function () {
        setLang(b.getAttribute("data-lang-btn"));
      });
    });
  }

  function initNav() {
    var burger = document.querySelector(".hamburger");
    var links = document.querySelector(".nav-links");
    if (burger && links) {
      burger.addEventListener("click", function () {
        links.classList.toggle("open");
      });
      links.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () { links.classList.remove("open"); });
      });
    }
  }

  function initActiveNav() {
    var path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(function (a) {
      var href = a.getAttribute("href");
      if (href === path || (path === "index.html" && href === "index.html")) {
        a.classList.add("active");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLang();
    initNav();
    initActiveNav();
  });
})();
