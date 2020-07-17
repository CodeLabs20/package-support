const express = require('express');
const mongoose = require('mongoose');
const packageModel = require('./packageSchema.js');
const itemModel = require('./itemSchema.js');

//EasyPostAPI
const apiKey = '<API Key>'; //Production API Key //need to seperate out to another config file
const EasyPost = require('@easypost/api');
//create EasyPostAPI object to make calls to API
const api = new EasyPost(apiKey, {
    timeout: 10000
});

const app = express();
app.use(express.json()); // Make sure it comes back as json

//put this info in another config file
mongoose.connect('mongodb+srv://<user>:<password>@cluster0.mle1w.mongodb.net/package-support?retryWrites=true&w=majority', {
  useNewUrlParser: true
});

const port = 3005; //Express.js 

const cors = require('cors');

//to prevent cross-origin request blocked errors 
app.use(cors());

//GET /
app.get('/', (request, response) => {
    response.send("Hello World");
});

//GET /testData
//to access this route from the client, route to 'https://localhost:3005/package'
app.get('/testData', (req, res) => {
    let data = {
        packageTrackingNumber: '1Z12345E1392654435',
        packageTotalItems: 3,
        packageItemOrderID: ['98456', '12556', '009978'],
        packageDeliverStatus: 'In Transit'
    }
    res.send(data);
})

//TODO: Create seperate folder for routes
//package routes

//GET /getAllPackages
//retrieve records for all packages in the database
app.get('/getAllPackages', async (req, res) => {
  const packages = await packageModel.find({});

  try {
    res.send(packages);
  } catch (err) {
    res.status(500).send(err);
  }
});

//GET /getPackage
//retrieve records for a single package
app.get('/getPackage/:trackingNum', async (req, res) => {

  const package = await packageModel.find({trackingNum: req.params.trackingNum});

  try {
    res.send(package);
  } catch (err) {
    res.status(500).send(err);
  }
});

//POST /createPackage
//create a record for a new package
app.post('/createPackage', async (req, res) => {
  const package = new packageModel(req.body);

  try {
    await package.save();
    res.send(package);
  } catch (err) {
    res.status(500).send(err);
  }
});

//PATCH /updatePackage/:id
//update an existing package record
app.patch('/updatePackage/:id', async (req, res) => {

  try {
    let package = await packageModel.findByIdAndUpdate(req.params.id, req.body);
    await package.save();

    package = await packageModel.findById(req.params.id);

    res.send(package);
  } catch (err) {
    res.status(500).send(err)
  }
})

//item routes

//GET /getAllItems
//retrieve records for all item in the database
app.get('/getAllItems', async (req, res) => {
  const item = await itemModel.find({});

  try {
    res.send(item);
  } catch (err) {
    res.status(500).send(err);
  }
});

//GET /getItem
//retrieve records for a single item
app.get('/getItem/:id', async (req, res) => {

  try {
    const item = await itemModel.findById(req.params.id);
    res.send(item);
  } catch (err) {
    res.status(500).send(err);
  }
});

//POST /createItem
//create a record for a new item
app.post('/createItem', async (req, res) => {
  let item = new itemModel(req.body);

  try {
    await item.save();
    item = await itemModel.findById(item.id);

    res.send(item);
  } catch (err) {
    res.status(500).send(err);
  }
});

//PATCH /updateItem/:id
//update an existing item record
app.patch('/updateItem/:id', async (req, res) => {

  try {
    let item = await itemModel.findByIdAndUpdate(req.params.id, req.body);
    await item.save();

    item = await itemModel.findById(req.params.id);

    res.send(item);
  } catch (err) {
    res.status(500).send(err)
  }
})

//easypost API routes
//POST /getDeliveryStatus
//get delivery status from EasyPost API
app.post('/getDeliveryStatus', async(req, res) => {
  const tracker = new api.Tracker({
      tracking_code: req.body.trackingNum,
      carrier: req.body.carrier
  })
  try{
      await tracker.save();
      res.send(tracker.status);
      //uncomment to get detailed tracking information
      //res.send(tracker);
  }
  catch(err){
      res.status(500).send(err);
  }
});

app.listen(port, () => console.log("Express server on port 3005"));

