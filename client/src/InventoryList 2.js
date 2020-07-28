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
import NumberFormat from 'react-number-format';

//Create inventory records for list

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function InventoryList() {
  const dataInit = [{
    itemName: '----', 
    price: '----',
    quantity: '----',
    checkInDate: '----',
    purchaseOrderStatus: '----'
  }]  
  const classes = useStyles();
  const [inventoryList, setInventoryList] = useState(dataInit);
  
  //currently display listens to any changes in MongoDB and rerenders
  //For Scalability
  //TODO: need to add a second parameter of an empty array to useEffect to only rerender and call database once
  //TODO: store user's input locally and append it after the database display to decrease calls to the DB
  useEffect(() => {
    axios.get('http://localhost:3005/getAllItems')
        .then(response => setInventoryList(response.data));
  });

  //array to convert data
  const purchaseOrderStatus = ['pre_transit', 'in_transit', 'out_for_delivery', 'delivered', 'return_to_sender', 'failure', 'unknown'];

  //for the table once the right array has been created
  //<TableCell>{purchaseOrderStatus[row.deliveryStatus]}</TableCell>

  function capitalize(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <React.Fragment>
      <Title>Inventory List</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Item Name</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Check-In Date</TableCell>
            <TableCell>Purchase Order Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inventoryList.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{capitalize(row.itemName)}</TableCell>
              <TableCell>
                <NumberFormat 
                  value={row.price} 
                  displayType={'text'} 
                  thousandSeparator={true} 
                  prefix={'$'} 
                  decimalScale={2} 
                  fixedDecimalScale={true}/>
              </TableCell>
              <TableCell>{row.quantity}</TableCell>
              <TableCell>{row.checkInDate}</TableCell>
              <TableCell>{row.purchaseOrderStatus}</TableCell>
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