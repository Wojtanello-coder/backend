const puppeteer = require('puppeteer');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

app.get('/', async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("http://plan.ckziu.jaworzno.pl/");
    lessons = (await page.$$eval(".link", options => { return options.map(option => [option.innerHTML, option.href])}));
    await browser.close();

    res.send(lessons);
    console.log(lessons);
})

app.get('/plan/:planURL', async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(req.params.planURL);
    dayLength = (await page.$$eval(".hours", options => options.map(option => {
        return option.children.length - 1;
    }) ));
    lessons = (await page.$$eval(".card", options => options.map(option => { // ".lesson-1,.lesson-2"
        let table = []
        
        for (let j = 0; j < option.children.length; j++) {
            for (const i in [0,1,2,3]) {
                table.push(option.children[j].children[4].children[0].children[i].innerHTML.trim())//
            }
        }
        return table;
    }) ));
    await browser.close();
    dayLength = dayLength[0];
    res.send({ "lesson": lessons, "dayLength": dayLength });
    console.log({ "lesson": lessons, "dayLength": dayLength });
})
app.listen(4001);