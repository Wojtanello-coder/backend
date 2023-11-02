const puppeteer = require('puppeteer');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

app.get('/', async (req, res) => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto("http://plan.ckziu.jaworzno.pl/");
    let lessons = (await page.$$eval(".link", options => { return options.map(option => [option.innerHTML, option.href.substring(30)])}));
    await browser.close();

    res.send(lessons);
    console.log(lessons);
})

app.get('/plan/:type/:planUrl', async (req, res) => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    console.log("http://plan.ckziu.jaworzno.pl/?" + req.params.type + "=" + req.params.planUrl);
    await page.goto("http://plan.ckziu.jaworzno.pl/?" + req.params.type + "=" + req.params.planUrl);
    dayLength = (await page.$$eval(".hours", options => options.map(option => {
        return option.children.length - 1;
    }) ));
    console.log(req.params.type)
    //return table;
    let lessons;
    switch (req.params.type) {
        case "classid": // TBA
            console.log("test");
            lessons = await page.$$eval(".card", options => options.map(option => { // ".lesson-1,.lesson-2"
                let table = []
                        //table.push(option);
                for (let j = 0; j < option.children.length; j++) {
                    for (const i in [0,1,2,3]) {
                        table.push(option.children[j].children[4].children[0].children[i].innerHTML.trim());//
                    }
                }
                return table;
            }));
            break;
    // }
            // let table = []
            
            //     console.log(type);
            // for (let j = 0; j < option.children.length; j++) {
            //     let childs;
            //     if(req.params.type == "teacher"){
            //         childs = option.children[j];
            //     }
            //     else {
            //         childs = option.children[j].children[4];
            //     }
            //     for (const i in [0,1,2,3]) {
            //         table.push(childs.children[0].children[i].innerHTML.trim())//
            //     }
            // }
        case "teacherid":
            
            lessons = await page.$$eval(".card", options => options.map(option => { // ".lesson-1,.lesson-2"
                let table = []
                        //table.push(option);
                for (let j = 0; j < option.children.length; j++) {
                    if (option.children[0].children[3]!=null) {
                        for (const i in [0,1,2,3]) {
                            table.push(option.children[0].children[i].innerHTML.trim());//
                        }
                    }
                }
                return table;
            }));
            break;
            // console.log("test");
            // console.log(page);
            // lessons = await page.$$eval(".card", options => console.log("true"));
            // //options.map(option => { // ".lesson-1,.lesson-2"
            // let table = [];
            // console.log("sukces!");
            // for (const i in [0,1,2,3]) {
            //     table.push(option.children[0].children[i].innerHTML.trim());
            // }
            return table;
            
        //}) );0
    
        default:
            lessons = [];
            break;
    }
    await browser.close();
    dayLength = dayLength[0];
    res.send({ "lesson": lessons, "dayLength": dayLength });
    console.log({ "lesson": lessons, "dayLength": dayLength });
});


app.get('/zastepstwa', async (req, res) => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    console.log();
    await page.goto("https://www.ckziu.jaworzno.pl/zastepstwa/");
    replacements = (await page.$$eval(".entry", divs => divs.map(div => {
        let table = [];
        let tbody = div.children[8].children[0];

        for (let i = 1; i < tbody.children.length; i++) {
            //console.log(tbody.children[i].innerHTML.trim());
            table.push(tbody.children[i].children[0].innerHTML.trim())
        }
        return table;
    }) ));
    //html = (await page.$$eval("body", divs => divs.map(div => div)));
    console.log(replacements);
    await browser.close();
    res.send(replacements);
    
});
app.listen(4001);