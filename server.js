const puppeteer = require('puppeteer');
const express = require('express');
const cors = require('cors');
const { Replacement } = require('./replacement');
const Reqs = require('./puppeteer');
const { pass } = require('./pass.json')

const app = express();
app.use(cors());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://multiplan:" + pass + "@cluster0.pdmzibl.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

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