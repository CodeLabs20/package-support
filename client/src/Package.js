import React, {useState, useEffect} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';

export default function Package(){

    const dataInit = {
        packageTrackingNumber: "Not Found",
        packageTotalItems: 0,
        packageItemOrderID: [],
        packageDeliverStatus: "Not Known"
    };

    const [packageData, setPackageData] = useState(dataInit);
    useEffect(() => {
        axios.get('http://localhost:3005/package')
            .then(response => setPackageData(response.data));
    }, []);

    return(
        <Card>
            <CardContent>
                <Typography variant="body2" component="p">
                    Package Tracking Number: {packageData.packageTrackingNumber}
                </Typography>
                <Typography variant="body2" component="p">
                    Total Items in Package: {packageData.packageTotalItems.toString()}
                </Typography>
                {packageData.packageItemOrderID.map((item, index) => {
                    return (
                    <Typography variant="body2" component="p">
                    Item {index}: {item}
                    </Typography>);
                })}
                <Typography variant="body2" component="p">
                    Delivery Status: {packageData.packageDeliverStatus}
                </Typography>
            </CardContent>
        </Card>

    );

}