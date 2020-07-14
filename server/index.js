const express = require('express');
const mongoose = require('mongoose');
const packageModel = require('./schema.js');

const app = express();
app.use(express.json()); // Make sure it comes back as json

mongoose.connect('mongodb+srv://<username>:<password>@cluster0.mle1w.mongodb.net/package-support?retryWrites=true&w=majority', {
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

//GET /package
//to access this route from the client, route to 'https://localhost:3005/package'
app.get('/package', (req, res) => {
    let data = {
        packageTrackingNumber: '1Z12345E1392654435',
        packageTotalItems: 3,
        packageItemOrderID: ['98456', '12556', '009978'],
        packageDeliverStatus: 'In Transit'
    }
    res.send(data);
})


app.get('/packageStatus', async (req, res) => {
  const packages = await packageModel.find({});

  try {
    res.send(packages);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/packageStatus', async (req, res) => {
  const package = new packageModel(req.body);

  try {
    await package.save();
    res.send(package);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => console.log("Express server on port 3005"));

