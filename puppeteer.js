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
    static async getPlanTable()  {
        console.log("test: teachertimetable");
        return;
    }
    static async getSubstitutions(link) {

        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.goto(link);
        substitutions = (await page.$$eval(".entry", divs => divs.map(div => {
            let table = [];
            let tbody = div.children[div.children.length-2].children[0];
            //let r = Replacement();
            
            for (let i = 1; i < tbody.children.length; i++) {
                table.push(tbody.children[i].children[1].innerHTML.trim())
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