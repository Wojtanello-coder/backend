// const Reqs = require('./puppeteer');
// //{ GetClassLinks, getTeacherTimeTable, getClassTimeTable, getSubstitutions }
// Reqs.GetClassLinks();
// Reqs.getTeacherTimeTable();
// Reqs.getClassTimeTable();
// Reqs.getSubstitutions();
console.log("wor5dozo" == [0-9]);
const puppeteer = require('puppeteer');


async function run() {
    
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto("https://www.google.com/");
    //await page.screenshot({ path: "testa.jpg", quality: 1 });
}

await run();