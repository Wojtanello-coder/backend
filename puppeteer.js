const puppeteer = require('puppeteer');

class request {
    static async GetClassLinks(link) {
        
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.goto(link);
        let lessons = (await page.$$eval(".link", options => { return options.map(option => [option.innerHTML, option.href.substring(30)])}));
        await browser.close();
        return lessons;
    }


    static async getPlanTable(link, type, url)  {
        //console.log("test: teachertimetable");

        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        console.log(link + "?" + type + "=" + url);
        await page.goto(link + "?" + type + "=" + url);
        let dayLength = (await page.$$eval(".hours", options => options.map(option => {
            return option.children.length - 1;
        }) ));
        console.log(type)
        //return table;
        let lessons;
        switch (type) {
            case "classid":
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
                return table;
                
        
            default:
                lessons = [];
                break;
        }
        await browser.close();
        dayLength = dayLength[0];
        return { "lesson": lessons, "dayLength": dayLength };
    }


    static async getSubstitutions(link) {

        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.goto(link);
        let substitutions = (await page.$$eval(".entry", divs => divs.map(div => {
            let table = [];
            let tbody = div.children[div.children.length-2].children[0];
            //let r = Replacement();
            
            for (let i = 1; i < tbody.children.length; i++) {
                table.push(tbody.children[i].children[1].innerHTML.trim());
            }
            return table;
        }) ));
        //html = (await page.$$eval("body", divs => divs.map(div => div)));
        //console.log(substitutions);
        await browser.close();
        return substitutions;
    }
}

module.exports = request;