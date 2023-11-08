const puppeteer = require('puppeteer');

class request {
    static async GetClassLinks(link) {
        
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.goto();
        let lessons = (await page.$$eval(".link", options => { return options.map(option => [option.innerHTML, option.href.substring(30)])}));
        await browser.close();
        return lessons;
    }

    static getTeacherTimeTable()  {
        console.log("test: teachertimetable");
        return;
    }

    static getClassTimeTable() {
        console.log("test: classtimetable");
        return;
    }

    static getSubstitutions() {
        console.log("test: substitutions");
        return;
    }
}

module.exports = request;