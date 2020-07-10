const express = require('express');
const app = express();
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

app.listen(port, () => console.log("Express server on port 3005"));

