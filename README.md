# 🌏 ChinaEase · 华易通

> A clean, bilingual (EN / 中文) service website for **foreigners in China** — language learning, travel, shopping, jobs, and hospital companion care.

ChinaEase is a fully static site (HTML / CSS / JS, no backend) designed to be deployed on CloudStudio and opened directly inside WeChat. It currently ships with **6 pages** and a lightweight **paid HSK materials** paywall (manual fulfillment).

## ✨ Features

- 🌐 **Bilingual** — one-click EN / 中文 switch, persisted in `localStorage`
- 🎨 **Fresh teal-green glassmorphism** UI with capsule / pill shapes
- 📚 **HSK language learning** — HSK 1–6 levels + paid PDF materials zone (paywall with redeem codes)
- ✈️ **Travel** — popular destinations, transport & visa tips
- 🛍️ **Shopping** — platforms, Alipay / WeChat Pay setup, tax refund
- 💼 **Jobs** — job boards, Z work visa steps, résumé tips
- 🏥 **Hospital companion care** — service scope, process, booking form, FAQ

## 📁 Structure

```
china-services/
├── index.html        # Home
├── language.html     # HSK language learning (+ paid PDFs)
├── travel.html       # Travel
├── shopping.html     # Shopping
├── jobs.html         # Jobs
├── hospital.html     # Hospital companion care
└── assets/
    ├── css/style.css
    ├── js/main.js          # i18n + mobile nav
    ├── js/paywall.js       # paid HSK materials logic
    ├── img/                # images & WeChat QR
    └── pdf/                # HSK sample PDFs (replace with real materials)
```

## 🚀 Deploy

Static site — deploy the folder to any static host (CloudStudio / GitHub Pages / Netlify).
Primary domain (GitHub Pages): https://tachikomaver2-ship-it.github.io/china-services/
CloudStudio mirror: https://cde70f17288e455aa26ff7ef47259118.sh3.agentos-app.net

## 🔑 Paid HSK materials (admin)

- Edit `assets/js/paywall.js` → `REDEEM` map to issue redeem codes.
- Demo code `HSK2026` unlocks all sample PDFs.
- Replace `assets/pdf/*.pdf` with real HSK textbooks (same filenames) to go live.

---

<p align="center">Made with ❤️ for foreigners exploring China · Built via vibe coding</p>
