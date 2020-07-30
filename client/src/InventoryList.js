import React, {useState, useEffect} from 'react';
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
import Typography from '@material-ui/core/Typography';

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
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell><Typography variant="h6">Item Name</Typography></TableCell>
            <TableCell><Typography variant="h6">Price</Typography></TableCell>
            <TableCell><Typography variant="h6">Quantity</Typography></TableCell>
            <TableCell><Typography variant="h6">Check-In Date</Typography></TableCell>
            <TableCell><Typography variant="h6">Purchase Order Status</Typography></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inventoryList.map((row) => (
            <TableRow key={row._id}>
              <TableCell><Typography variant="body1">{capitalize(row.itemName)}</Typography></TableCell>
              <TableCell>
              <Typography variant="body1"><NumberFormat 
                  value={row.price} 
                  displayType={'text'} 
                  thousandSeparator={true} 
                  prefix={'$'} 
                  decimalScale={2} 
                  fixedDecimalScale={true}/></Typography>
              </TableCell>
              <TableCell><Typography variant="body1">{row.quantity}</Typography></TableCell>
              <TableCell><Typography variant="body1">{moment(row.checkInDate).format('MM/DD/YYYY')}</Typography></TableCell>
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