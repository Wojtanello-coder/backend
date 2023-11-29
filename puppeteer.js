const puppeteer = require('puppeteer');

class request {
    static async GetClassLinks(link) {
        
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.goto(link);
        await page.type(".validate", "6565");
        await page.click(".btn");
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
        await page.type(".validate", "6565");
        await page.click(".btn");
        await page.goto(link + "?" + type + "=" + url);
        await page.screenshot({ path: `./test.jpg`});
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
        await page.type(".form-control", "6565");
        //await page.click(".btn-primary");
        await page.screenshot({ path: "test2.jpg", quality: 1 });
        let substitutionObject = (await page.$$eval(".entry", divs => divs.map(entry => { //>table>tbody
            let tbody = entry.children[entry.children.length-2].children[0]
            let table = [];
            let subTable = [];
            //let r = Replacement();
            //subTable = tbody.innerHTML
            
            let className = "";
            for (let i = 1; i < tbody.children.length; i++) {
                let subObj = {};
                //     "class": "", // Done
                //     "teacher": "", // Done
                //     "hour": 0, // Done
                //     "subject": "", // Done
                //     "room": "", // Done
                //     "cancelled": false, // Done
                //     "subsTeacher": "",
                //     "subHour": 0, // Done
                //     "subSubject": "", // Done
                //     "subRoom": "" // Done

                // }
                let tbody_inner = tbody.children[i]; // div about single sub (has data)
                if (tbody_inner.children.length == 5) { // 5 is when the first is klass
                    table.push([]);
                    className = tbody_inner.children[0].innerHTML.trim()
                    table.at(-1).push(tbody_inner.children[1].innerHTML.trim());
                }
                else {
                    table.at(-1).push(tbody_inner.children[0].innerHTML.trim());
                }
                let len = tbody_inner.children.length;
                let hours = tbody_inner.children[len - 4].innerHTML.trim().split("-&gt;");
                let subjects = tbody_inner.children[len - 2].innerHTML.trim().split("-&gt;");
                let substitution = tbody_inner.children[len - 1].innerHTML.trim().split(" / ");
                let rooms = (substitution.length == 2) ? substitution[1].trim().split(" -&gt; ") : ["", ""];

                subObj["class"] = className
                subObj["teacher"] = tbody_inner.children[len - 3].innerHTML.trim();
                subObj["hour"] = hours[0];
                subObj["subject"] = subjects[0];
                subObj["room"] = rooms[0];
                subObj["cancelled"] = substitution=="Odwołane" ? true : false;
                subObj["subTeacher"] = (substitution.length == 1) ? substitution[0] : "";

                subObj["subHour"] = (hours.length>1) ? hours[1] : ""
                subObj["subSubject"] = (subjects.length>1) ? subjects[1] : ""
                subObj["subRoom"] = rooms[1];
                
                
                subTable.push(subObj);
            }
            let subListObj = {
                "desc": "opis",
                "date": "data",
                "teachers": entry.children[11].children[0].children[1].innerHTML.split(", "), // 10 isn't consistant
                "substitutions": subTable
            }
            //return table;
            return subListObj;
        }) ));
        //const html = (await page.$$eval("body", divs => divs.map(div => div)));
        //console.log(substitutions);
        await browser.close();
        return substitutionObject;
    }
}

module.exports = request;