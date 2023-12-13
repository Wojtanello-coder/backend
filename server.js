const puppeteer = require('puppeteer');
const express = require('express');
const cors = require('cors');
const { Replacement } = require('./replacement');
const Reqs = require('./puppeteer');
const { user, pass } = require('./pass.json');
const dataFile = require('./data.json');

const app = express();
app.use(cors());
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://" + user + ":" + pass + "@cluster0.pdmzibl.mongodb.net/";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', async (req, res) => {
    console.log(`${Date()} - ${req.method} request at ${req.path}`)
    let data = [];
    try {
        data = await Reqs.GetClassLinks("http://plan.ckziu.jaworzno.pl/");
        await client.connect();
        const db = client.db("Cluster0");
        const coll = db.collection("lessonsPlan");
        
        const docs = [
            data
        ];
        await coll.dropIndexes();
        const result = await coll.insertMany(data);
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
        //const d = new Date();
        const _subs = subs[0].substitutions.filter(sub => { sub.classid = data.name; return sub.class == dataFile[data.name]})
        const _data = data.data[(new Date().getDay()-1)%5]

        insertSubsToPlan(_subs, _data, parseInt(data.startHour))

        // console.log(_subs);
        data.subs = _subs
        // console.log(_data);
        data.data = _data;
        
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
        plan[i].forEach(pln => {
            hourSubs = subs.filter((sub) => {
                return (parseInt(sub.hour) == i + startHour) && (sub.teacher == pln.name);
            })
            console.log(subs[0].hour + " - " + i.toString() + " - " + startHour.toString());
            console.log(pln);
            console.log(hourSubs);
            console.log("------");
        });
    }
}