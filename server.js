const puppeteer = require('puppeteer');
const express = require('express');
const cors = require('cors');
const { Replacement } = require('./replacement');
const Reqs = require('./puppeteer');
// const { user, pass } = require('./pass.json');
const dataFile = require('./data.json');

const app = express();
app.use(cors());
const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://" + user + ":" + pass + "@cluster0.pdmzibl.mongodb.net/";

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

app.get('/', async (req, res) => {
    console.log(`${Date()} - ${req.method} request at ${req.path}`)
    let data = [];
    try {
        data = await Reqs.GetClassLinks("http://plan.ckziu.jaworzno.pl/");
        // await client.connect();
        // const db = client.db("Cluster0");
        // const coll = db.collection("lessonsPlan");
        
        // const docs = [
        //     data
        // ];
        // await coll.dropIndexes();
        // const result = await coll.insertMany(data);
    }
    catch (err) {
        console.log(`${Date()} - ${err}`)
    }
    finally {
        await client.close();
        console.log("Done")
    }
    
    res.send(data);
    //console.log(data);
})

app.get('/plan/:type/:planUrl', async (req, res) => {
    console.log(`${Date()} - ${req.method} request at ${req.path}`)
    let data = [];
    try {
        data = await Reqs.getPlanTable("http://plan.ckziu.jaworzno.pl/", req.params.type, req.params.planUrl)
    }
    catch (err) {
        console.log(`${Date()} - ${err}`)
    }
    finally {
        console.log("Done")
    }
    
    res.send(data);
    //console.log(data);
});

app.get('/day/:type/:planUrl', async (req, res) => {
    console.log(`${Date()} - ${req.method} request at ${req.path}`)
    let data = [];
    try {
        subs = await Reqs.getSubstitutions("https://www.ckziu.jaworzno.pl/zastepstwa/");
        data = await Reqs.getPlanTable("http://plan.ckziu.jaworzno.pl/", req.params.type, req.params.planUrl)
        // missing: class name from plans, instead of classid ("5d TE"/"BF0B9B0E2C34F558"); day number from subs (4 - friday);
        const d = (new Date().getDay()-1)%5
        let _subs = subs[0].substitutions.filter(sub => { sub.classid = data.name; return sub.class == dataFile[data.name]})
        let _data = data.data[d]

        _data = insertSubsToPlan(_subs, _data, parseInt(data.startHour))

        data.data[d] = _data

        // console.log(_subs);
        // data.subs = _subs
        // console.log(_data);
        // data.data = _data;
        
    }
    catch (err) {
        console.log(`${Date()} - ${err}`)
    }
    finally {
        console.log("Done")
    }
    
    res.send(data);
    //console.log(data);
});


app.get('/zastepstwa', async (req, res) => {
    console.log(`${Date()} - ${req.method} request at ${req.path}`)
    let data = [];
    try {
        data = await Reqs.getSubstitutions("https://www.ckziu.jaworzno.pl/zastepstwa/");
    }
    catch (err) {
        console.log(`${Date()} - ${err}`)
    }
    finally {
        console.log("Done")
    }
    res.send(data);
    //console.log(data);
});
app.listen(4001);

const insertSubsToPlan = (subs, plan, startHour) => {

    for (let i = 0; i < plan.length; i++) {
        for (let j = 0; j < plan[i].length; j++) {
            hourSubs = subs.filter((sub) => {
                return (parseInt(sub.hour) == i + startHour) && (sub.teacher == plan[i][j].name);
            })
            if(hourSubs.length > 0){
                hourSubs = hourSubs[0]
                // console.log(subs[0].hour + " - " + i.toString() + " - " + startHour.toString());
                // console.log(plan[i][j]);
                // console.log(hourSubs);
                console.log("$");

                // changing for every sub possibility
                if (hourSubs.cancelled) {
                    plan[i].splice(j, 1);
                    console.log("cancelled");
                    continue;
                }
                if(hourSubs.subTeacher != '') {
                    plan[i][j].name = hourSubs.subTeacher
                    console.log("changed teacher");
                }
                if(hourSubs.subHour != '') {
                    plan[i].push(plan[i][j]);
                    plan[i].splice(j, 1);
                    console.log("changed hour");
                }
                if(hourSubs.subSubject != '') {
                    plan[i][j].subject = hourSubs.subSubject
                    console.log("changed subject");
                }
                if(hourSubs.subRoom != '') {
                    plan[i][j].room = hourSubs.subRoom
                    console.log("changed room");
                }
            }
        }
        console.log("------");
    }
    return plan;
}