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
        //console.log(link + "?" + type + "=" + url);
        await page.goto(link + "?" + type + "=" + url);
        let dayLength = (await page.$$eval(".hours", options => options.map(option => {
            return option.children.length - 1;
        }) ));
        //console.log(type)
        //return table;
        let lessons;
        switch (type) {
            case "classid":
                //console.log("test");
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
        let substitutionObject = (await page.$$eval(".entry", divs => divs.map(div => {
            let table = [];
            let subTable = [];
            let tbody = div.children[div.children.length-2].children[0];
            //let r = Replacement();
            
            for (let i = 1; i < tbody.children.length; i++) {
                let subObj = {};
                //     "class": "",
                //     "teacher": "",
                //     "hour": 0,
                //     "subject": "",
                //     "cancelled": false,
                //     "substitution": "",
                //     "subHour": 0,
                //     "subSubject": "",
                //     "subRoom": ""

                // }
                let tbody_inner = tbody.children[i];
                if (tbody_inner.children.length == 5) {
                    console.log("5");
                    table.push([]);
                    table.at(-1).push(tbody_inner.children[1].innerHTML.trim());
                }
                else {
                    table.at(-1).push(tbody_inner.children[0].innerHTML.trim());
                }
                let len = tbody_inner.children.length;
                let hours = tbody_inner.children[len - 4].innerHTML.trim().split("->");
                let subjects = tbody_inner.children[len - 2].innerHTML.trim().split("->");
                subObj["teacher"] = tbody_inner.children[len - 3].innerHTML.trim();
                subObj["hour"] = hours[0];
                subObj["subject"] = subjects[0];

                (hours.length>1)?
                    subObj["subHour"] = hours[1]
                :
                    subObj["subHour"] = "a"

                (subjects.length>1)?
                    subObj["subSubjects"] = subjects[1]
                :
                    subObj["subSubjects"] = "b"
                
                
                subTable.push(subObj);
            }
            let subListObj = {
                "desc": "opis",
                "date": "data",
                "teachers": [
                    // nieobecni nauczyciele
                ],
                "substitutions": subTable
            }
            //return table;
            return subListObj;
        }) ));
        //html = (await page.$$eval("body", divs => divs.map(div => div)));
        //console.log(substitutions);
        await browser.close();
        return substitutionObject;
    }
}

module.exports = request;