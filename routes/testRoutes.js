const express = require('express');

const app = express();


//test routes

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

module.exports = app;