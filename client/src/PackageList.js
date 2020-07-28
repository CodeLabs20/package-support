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
import InventoryForm from './InventoryForm';
import ClearIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/Check';


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
    _id: '',
    trackingNum: '', 
    deliveryStatus: '',
    checkInStatus: '',
    carrier: ''
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
  const deliveryStatus = ['pre_transit', 'in_transit', 'out_for_delivery', 'delivered', 'return_to_sender', 'failure', 'unknown'];
  const checkinStatus = [<ClearIcon style={{ color: 'red'}}></ClearIcon>, <CheckIcon style={{ color: '#008000'}}></CheckIcon>];

  //counter for table cell keys
  let i = 0;

  function capitalize(str){
    if (typeof(str) === "string") {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  }

  return (
    <React.Fragment>
      <Title>Package List</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Tracking Number</TableCell>
            <TableCell>Carrier</TableCell>
            <TableCell>Delivery Status</TableCell>
            <TableCell>Check-in Status</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {packageList.map((row, index) => (
            <TableRow key={row._id}>
              <TableCell>{row.trackingNum}</TableCell>
              <TableCell>{row.carrier}</TableCell>
              <TableCell>{capitalize(deliveryStatus[row.deliveryStatus])}</TableCell>
              <TableCell>{capitalize(checkinStatus[row.checkInStatus])}</TableCell>
              <TableCell><InventoryForm _id={row._id} trackingNum={row.trackingNum} carrier={row.carrier}/></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}