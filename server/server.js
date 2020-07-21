const express = require('express');
const mongoose = require('mongoose');
const config = require('config-yml')

//routers
const packageRouter = require('./routes/packageRoutes.js');
const itemRouter = require('./routes/itemRoutes.js');
const testRouter = require('./routes/testRoutes.js');


//EasyPostAPI
const apiKey = config.easy_post.prod_key; //Production API Key
const EasyPost = require('@easypost/api');
//create EasyPostAPI object to make calls to API
const api = new EasyPost(apiKey, {
    timeout: 10000
});


const app = express();
app.use(express.json()); // Make sure it comes back as json

//connect to db
mongoose.connect(config.mongo_db.uri, {
  useNewUrlParser: true
});

const port = 3005; //Express.js 

const cors = require('cors');

//to prevent cross-origin request blocked errors 
app.use(cors());

app.use(packageRouter);
app.use(itemRouter);
app.use(testRouter);


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

