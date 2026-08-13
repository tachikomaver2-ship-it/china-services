/* ============================================================
   ChinaEase — Form Mailer (EmailJS integration)
   Sends form submissions as email notifications.
   
   SETUP (one-time, ~3 minutes):
   1. Go to https://www.emailjs.com/ — sign up free (Gmail login works)
   2. Add an Email Service:
      → Email Services → Add Service → Select "Gmail" → Connect your
         tachikomaver2@gmail.com account (follow OAuth prompts)
   3. Create an Email Template:
      → Email Templates → Create Template → ID: template_chinaease
      → Subject: "New {{service_type}} from {{from_name}}"
      → Body (use this exact content):
        
        New submission from ChinaEase website
        
        ======
        SERVICE: {{service_type}}
        NAME:    {{from_name}}
        EMAIL:   {{from_email}}
        PHONE:   {{from_phone}}
        -----
        {{message}}
        ======
        Submitted at: {{submit_time}}
        Page: {{page_url}}
        
   4. Copy your 3 credentials below (replace the placeholders):
      - PUBLIC_KEY  → from Account → General (starts with pk_)
      - SERVICE_ID  → from Email Services (starts with service_)
      - TEMPLATE_ID→ from Email Templates (template_chinaease)
   
   FREE TIER: 200 emails / month — plenty for this site.
   ============================================================ */
(function () {
  "use strict";

  // ── STEP 1: Fill in your EmailJS credentials ──
  var CONFIG = {
    PUBLIC_KEY:  "3LFsBrMJxAKNN0iTy",           // EmailJS Public Key (Account → General)
    SERVICE_ID:  "service_z16syjd",            // EmailJS Email Service ID (Gmail → tachikomaver2@gmail.com)
    TEMPLATE_ID: "template_1l732as",           // EmailJS Email Template ID
    TO_EMAIL:    "tachikomaver2@gmail.com"       // where notifications arrive
  };

  // ── Internal state ──
  var _ready = false;
  var _initing = false;

  function isConfigured() {
    return (
      CONFIG.PUBLIC_KEY &&
      !CONFIG.PUBLIC_KEY.startsWith("YOUR_") &&
      CONFIG.SERVICE_ID &&
      !CONFIG.SERVICE_ID.startsWith("YOUR_") &&
      CONFIG.TEMPLATE_ID &&
      !CONFIG.TEMPLATE_ID.startsWith("YOUR_")
    );
  }

  function loadSDK() {
    if (_initing || _ready || window.emailjs) return;
    _initing = true;
    var s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    s.async = true;
    s.onload = function () {
      try {
        emailjs.init(CONFIG.PUBLIC_KEY);
        _ready = true;
      } catch (e) { /* sdk loaded but init may fail without valid key */ }
    };
    document.head.appendChild(s);
  }

  function getField(form, name) {
    var el = form.querySelector("[name='" + name + "']");
    return el ? el.value.trim() : "";
  }

  function showFeedback(form, ok, msg) {
    // Remove old feedback
    var old = form.parentElement.querySelector(".form-feedback");
    if (old) old.remove();

    var fb = document.createElement("div");
    fb.className = "form-feedback";
    fb.textContent = msg;
    if (!ok) fb.classList.add("form-feedback-error");
    else fb.classList.add("form-feedback-ok");

    form.style.display = "none";          // hide form during feedback
    fb.style.display = "block";

    // Insert after form or inside parent card
    var target = form.nextElementSibling || form.parentElement;
    target.insertBefore(fb, form.nextSibling);

    if (ok) {
      setTimeout(function () {
        form.reset();
        form.style.display = "";
        fb.style.display = "none";
      }, 4000);
    } else {
      // Error: let user retry after delay
      setTimeout(function () {
        form.style.display = "";
        fb.style.display = "none";
      }, 3500);
    }
  }

  async function sendEmail(params) {
    if (!_ready) throw new Error("EmailJS not ready");
    await emailjs.send(CONFIG.SERVICE_ID, CONFIG.TEMPLATE_ID, params);
  }

  // ── Public API: attach to any <form> element ──
  window.ChinaEaseFormMailer = {
    /** Call once on page load (loads SDK lazily) */
    init: function () { if (isConfigured()) loadSDK(); },

    /**
     * Wire a <form> to send via EmailJS on submit.
     * @param {HTMLFormElement} form
     * @param {Object} opts
     * @param {string} opts.serviceType  — label for the email subject, e.g. "Hospital Companion Booking"
     * @param {string} [opts.pageLabel]  — which page, for tracking
     */
    bind: function (form, opts) {
      if (!form) return;
      opts = opts || {};
      var serviceType = opts.serviceType || "Website Inquiry";
      var pageLabel = opts.pageLabel || location.pathname;

      form.addEventListener("submit", async function (e) {
        e.preventDefault();

        var isZh = document.body.classList.contains("lang-zh");

        // Basic validation
        var required = form.querySelectorAll("[required]");
        for (var i = 0; i < required.length; i++) {
          if (!required[i].value.trim()) {
            required[i].focus();
            showFeedback(
              form, false,
              isZh ? "请填写所有必填项" : "Please fill in all required fields"
            );
            return;
          }
        }

        // Collect data
        var params = {
          service_type: serviceType,
          from_name:    getField(form, "name") || getField(form, "from_name") || "Anonymous",
          from_email:   getField(form, "email") || getField(form, "from_email") || "N/A",
          from_phone:   getField(form, "phone") || getField(form, "from_phone") || "N/A",
          message:      getField(form, "message") || getField(form, "needs") || "",
          to_email:     CONFIG.TO_EMAIL,
          submit_time:  new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" }),
          page_url:     location.href,
          page_label:   pageLabel
        };

        // Also grab extra fields dynamically
        var allInputs = form.querySelectorAll("input, textarea, select");
        for (var j = 0; j < allInputs.length; j++) {
          var fld = allInputs[j];
          if (fld.name && !params[fld.name] && fld.type !== "submit") {
            params["extra_" + fld.name] = fld.value.trim();
          }
        }

        // Try sending via EmailJS
        if (isConfigured()) {
          if (!_ready) loadSDK();

          showFeedback(
            form, false,
            isZh ? "正在发送..." : "Sending..."
          );

          try {
            // Wait up to 5s for SDK to be ready
            var waitStart = Date.now();
            while (!_ready && Date.now() - waitStart < 5000) {
              await new Promise(function (r) { return setTimeout(r, 200); });
            }

            await sendEmail(params);

            showFeedback(
              form, true,
              isZh
                ? "✓ 已发送！我们会尽快联系您。\n(Confirmation sent to " + CONFIG.TO_EMAIL + ")"
                : "✓ Sent! We'll contact you shortly.\n(Confirmation sent to " + CONFIG.TO_EMAIL + ")"
            );
          } catch (err) {
            console.error("ChinaEase FormMailer error:", err);
            showFeedback(
              form, false,
              isZh
                ? "发送失败，请直接发邮件至 " + CONFIG.TO_EMAIL
                : "Send failed. Please email " + CONFIG.TO_EMAIL + " directly."
            );
          }
        } else {
          // Fallback: not configured yet — show manual instructions
          var body =
            "Service: " + serviceType + "\n" +
            "Name: " + params.from_name + "\n" +
            "Email: " + params.from_email + "\n" +
            "Phone: " + params.from_phone + "\n" +
            (params.message ? "Message:\n" + params.message + "\n" : "") +
            "\n---\nSubmitted from ChinaEase website (" + pageLabel + ")";

          // Copy to clipboard
          if (navigator.clipboard) {
            navigator.clipboard.writeText(body).catch(function () {});
          }

          showFeedback(
            form, true,
            isZh
              ? "⚠ 邮件服务尚未配置，信息已复制到剪贴板。\n请发送到 " + CONFIG.TO_EMAIL
              : "⚠ Email not configured yet. Info copied to clipboard.\nPlease send to " + CONFIG.TO_EMAIL
          );
        }
      });
    },

    /** Check if EmailJS is properly configured */
    isReady: function () { return _ready; },
    isConfigured: function () { return isConfigured(); }
  };

  // Auto-init when DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { window.ChinaEaseFormMailer.init(); });
  } else {
    window.ChinaEaseFormMailer.init();
  }
})();
