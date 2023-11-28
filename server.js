const puppeteer = require('puppeteer');
const express = require('express');
const cors = require('cors');
const { Replacement } = require('./replacement');
const Reqs = require('./puppeteer');

const app = express();
app.use(cors());

app.get('/', async (req, res) => {
    console.log(`${Date()} - ${req.method} request at ${req.path}`)
    let data = [];
    try {
        data = await Reqs.GetClassLinks("http://plan.ckziu.jaworzno.pl/");
    }
    catch (err) {
        console.log(`${Date()} - ${err}`)
    }
    finally {
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