import React, {useState, useEffect} from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import axios from 'axios';

//Create package records for list
//id key is created to create rows
function createData(id, trackingNum, deliveryStatus, checkInStatus) {
  return { id, trackingNum, deliveryStatus, checkInStatus };
}

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function PackageList() {
  const dataInit = [{
    trackingNum: '----', 
    deliveryStatus: '----',
    checkInStatus: '----'
  }]  
  const classes = useStyles();
  const [packageList, setPackageList] = useState(dataInit);
  
  //currently display listens to any changes in MongoDB and rerenders
  //For Scalability
  //TODO: need to add a second parameter of an empty array to useEffect to only rerender and call database once
  //TODO: store user's input locally and append it after the database display to decrease calls to the DB
  useEffect(() => {
    axios.get('http://localhost:3005/getAllPackages')
        .then(response => setPackageList(response.data));
  });

  //arrays to convert data
  const deliveryStatus = ['pre_transit', 'transit', 'out_for_delivery', 'delivered', 'return_to_sender', 'failure', 'unknown'];
  const checkinStatus = ['not checked in', 'checked in'];

  return (
    <React.Fragment>
      <Title>Package List</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Tracking Number</TableCell>
            <TableCell>Delivery Status</TableCell>
            <TableCell>Check-in Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {packageList.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.trackingNum}</TableCell>
              <TableCell>{deliveryStatus[row.deliveryStatus]}</TableCell>
              <TableCell>{checkinStatus[row.checkInStatus]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          See more orders
        </Link>
      </div>
    </React.Fragment>
  );
}