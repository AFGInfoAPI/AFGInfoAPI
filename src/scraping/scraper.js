const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  console.log('Navigating to page...');
  await page.goto('http://nsia.gov.af/services', { timeout: 60000 });

  console.log('Selecting language...');
  await page.waitForSelector('#en');
  await page.click('#en');

  console.log('Waiting for element to be loaded...');
  await page.waitForSelector('[id="16561"]');

  console.log('Clicking on element...');
  await page.evaluate(() => {
    document.querySelector('[id="16561"]').click();
  });
  console.log('Finding link...');
  await page.waitForSelector('xpath=//a[contains(text(), "2023")]', { timeout: 60000 });
  const href = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a'));

    // Fint the link that contains the biggest year
    const biggestYear = links.reduce((acc, link) => {
      const year = link.textContent.match(/\d+/);
      return year && year[0] > acc ? year[0] : acc;
    }, 0);

    const link = links.find(a => a.textContent.includes(biggestYear));
    return link ? link.href : '';
  });

  if (href) {
    console.log('Downloading file...');
    const response = await axios({
      url: href,
      method: 'GET',
      responseType: 'stream',
    });

    const writer = fs.createWriteStream('./latest_file.xlsx');
    response.data.pipe(writer);

    writer.on('finish', () => {
      console.log('File downloaded');
    });

    writer.on('error', err => {
      console.error('Error while downloading file', err);
    });
  } else {
    console.log('No link found');
  }

  console.log('Closing browser...');
  await browser.close();
})();
