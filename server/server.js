const express = require('express');
const mongoose = require('mongoose');
const config = require('config-yml');

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
const axios = require('axios');

//to prevent cross-origin request blocked errors 
app.use(cors());

app.use(packageRouter);
app.use(itemRouter);
app.use(testRouter);

//this code is taken from CreateTrackingNum.js
//refactor code to import it instead, but this might run into conflicts
function translateDeliveryStatus(status){
  let statusCode;
  const statusText = ['pre_transit', 'in_transit', 'out_for_delivery', 'delivered', 'return_to_sender', 'failure', 'unknown'];
  switch (status) {
      case statusText[0]:
          statusCode = 0;
          break;
      case statusText[1]:
          statusCode = 1;
          break;
      case statusText[2]:
          statusCode = 2;
          break;
      case statusText[3]:
          statusCode = 3;
          break;
      case statusText[4]:
          statusCode = 4;
          break;
      case statusText[5]:
          statusCode = 5;
          break;
      default:
          statusCode = 6;  
  }
  return statusCode;
}


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

//webhooks event handler
app.post("/trackerUpdated", (req, res) => {
  res.status(200).end(); // Responding to webhooks before it retries
  if(req.body.description == "tracker.updated"){
      let deliveryStatus = req.body.result.status;
      //console.log(deliveryStatus);
      let tracking_code = req.body.result.tracking_code;
      deliveryStatus = translateDeliveryStatus(deliveryStatus); 
      //console.log(tracking_code);
      axios.patch(`http://localhost:3005/updatePackage/${tracking_code}`, {deliveryStatus: deliveryStatus})
          .then((response) => console.log(`TRACKER STATUS UPDATED: ${response.data.deliveryStatus}`))
          .catch((err) => console.log(err));
  }
});



app.listen(port, () => console.log("Express server on port 3005"));

