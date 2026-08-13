const { chromium } = require('playwright');
const path = require('path');
const dir = '/Users/yc/WorkBuddy/2026-08-13-10-24-12/china-services/xhs';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 600, height: 600 }, deviceScaleFactor: 2 });
  const files = ['avatar1', 'avatar2', 'avatar3'];
  for (const f of files) {
    await page.goto('file://' + path.join(dir, f + '.html'));
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(dir, f + '.png'), clip: { x: 0, y: 0, width: 600, height: 600 } });
    console.log('rendered', f + '.png');
  }
  await browser.close();
})();
