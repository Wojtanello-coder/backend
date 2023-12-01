const puppeteer = require('puppeteer');
const express = require('express');
const cors = require('cors');
const { Replacement } = require('./replacement');
const Reqs = require('./puppeteer');
const { user, pass } = require('./pass.json')

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
        data.day = 4
        console.log(subs[0].substitutions.filter(sub => { sub.classid = "BF0B9B0E2C34F558"; return sub.class == "5d TE"}));
        console.log(data.data[4]);
        data.data = data.data[4];
        
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