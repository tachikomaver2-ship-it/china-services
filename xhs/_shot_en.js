const { chromium } = require('playwright');
const path = require('path');

const base = '/Users/yc/WorkBuddy/2026-08-13-10-24-12/china-services/xhs';
const cards = ['card1_en', 'card2_en', 'card3_en'];

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1440, deviceScaleFactor: 2 },
  });
  for (const c of cards) {
    await page.goto('file://' + path.join(base, c + '.html'));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(base, c + '.png') });
    console.log('rendered', c + '.png');
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
