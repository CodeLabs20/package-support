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
import EditButton from './EditButtonInventory';
import moment from 'moment';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  block:{
    width: theme.spacing(12),
    height: theme.spacing(5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    borderRadius: 50
  },
  grey: {
    color: '#000000',
    backgroundColor: '#BDBDBD',
  },
  black: {
    color: '#FFFFFF',
    backgroundColor: '#000000',
  },
  blue:{
    color: '#FFFFFF',
    backgroundColor: '#2196F3'
  },
  green:{
    color: '#FFFFFF',
    backgroundColor: '#43A047'
  }
}));

export default function InventoryList() {

  const dataInit = [];  

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
  const purchaseOrderStatus = ['not created', 'created', 'pending', 'completed'];

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
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inventoryList.map((row) => (
            <TableRow key={row._id}>
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
              <TableCell>{moment(row.checkInDate).format('MM/DD/YYYY')}</TableCell>
              <TableCell><StatusColor text={capitalize(purchaseOrderStatus[row.purchaseOrderStatus])} /></TableCell>
              <TableCell><EditButton itemId={row._id} status={purchaseOrderStatus[row.purchaseOrderStatus]}/></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}

export function StatusColor(props){
  const {text} = props;
  const classes = useStyles();
  const colorChoice = findColorStatus(text);
  function findColorStatus(status){
    let colorClass;
    let statuses = ['Not created', 'Created', 'Pending', 'Completed'];
    let allColors = [classes.grey, classes.black, classes.blue, classes.green];
    switch(status){
      case statuses[0]:
        colorClass = allColors[0];
        break;
      case statuses[1]:
        colorClass = allColors[1];
        break;
      case statuses[2]:
        colorClass = allColors[2];
        break;  
      case statuses[3]:
        colorClass = allColors[3];
        break;    
      default:
        console.log('No color classes found.');
    }
    return colorClass;
  }

  const colorBlock = clsx(classes.block, colorChoice);

  return(
    <div className={colorBlock}>
      {text}
    </div>
  );
}