const express = require('express');
const itemModel = require('../models/item.js');

const app = express();


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
  console.log("calling createItem");
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

module.exports = app;