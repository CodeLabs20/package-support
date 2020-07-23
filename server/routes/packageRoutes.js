const express = require('express');
const packageModel = require('../models/package.js');

const app = express();


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

//PATCH /updatePackage/:tracking_code
//update an existing package record
app.patch('/updatePackage/:tracking_code', async (req, res) => {

  try {
    //uncomment to update by record id
    /* let package = await packageModel.findByIdAndUpdate(req.params.id, req.body);
    await package.save();

    package = await packageModel.findById(req.params.id); */

    let package = await packageModel.findOneAndUpdate({trackingNum: req.params.tracking_code}, {deliveryStatus: req.body.deliveryStatus});
    await package.save();

    //uncomment to pass back updated record by id
    //package = await packageModel.findById(req.params.id);
    package = await packageModel.findOne({trackingNum: req.params.tracking_code});

    res.send(package);
  } catch (err) {
    res.status(500).send(err)
  }
})

module.exports = app;
