const express = require('express');
const app = express();
const port = 3005;

const cors = require('cors');

app.use(cors());

app.use(express.static('public'));


app.get('/', (request, response) => {
    response.send("Hello World");
});

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

