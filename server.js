const puppeteer = require('puppeteer');
const express = require('express');
const cors = require('cors');
const { Replacement } = require('./replacement');
const Reqs = require('./puppeteer');

const app = express();
app.use(cors());

app.get('/', async (req, res) => {
    
    let data = await Reqs.GetClassLinks("http://plan.ckziu.jaworzno.pl/");
    
    res.send(data);
    console.log(data);
})

app.get('/plan/:type/:planUrl', async (req, res) => {

    let data = await Reqs.getPlanTable("http://plan.ckziu.jaworzno.pl/", req.params.type, req.params.planUrl)
    
    res.send(data);
    console.log(data);
});


app.get('/zastepstwa', async (req, res) => {
    let data = await Reqs.getSubstitutions("https://www.ckziu.jaworzno.pl/zastepstwa/");
    res.send(data);
    console.log(data);
});
app.listen(4001);