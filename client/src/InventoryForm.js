import React, {useState, useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import {Controller, useForm} from 'react-hook-form';
import './App.css';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';  
import NumberFormat from 'react-number-format';

import 'date-fns';

import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import IconButton from '@material-ui/core/IconButton';


let itemList = [];
let id = 0;
let item;
let packageInfo;
  
export default function Form(props) {
  
  const purchaseOrderStatus = [{
    value: 'not created',
    label: 'Not Created' //change to image + text in the future,
  },
  {
    value: 'created',
    label: 'Created',
  },
  {
    value: 'pending',
    label: 'Pending',
  },
  {
    value: 'completed',
    label: 'Completed',
  }];
    
  //console.log(this.props);
  const [open, setOpen] = React.useState(false);
  
  let dataInit = []
  const [inventoryList, setInventoryList] = useState(dataInit);  
  const {control, reset, handleSubmit} = useForm(
    {
      defaultValues:{
          
        itemName: '',
        quantity: '',
        price: '',
        purchaseOrderStatus: 'not created',
        checkedInDate: new Date(Date.now()).toString()      
      }
    }
  );
  
  const [selectedDate, setSelectedDate] = React.useState(Date.now());
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  //to make dialog responsive
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    //clear out items in list upon closing dialog
    itemList = [];
  };
  

  const statusText = ['not created', 'created', 'pending', 'completed'];
  function translatePurchaseOrder(status){
        let statusCode;
        switch (status) {
            case statusText[0]:
                statusCode = 0;
                break;
            case statusText[1]:
                statusCode = 1;
                break;
            case statusText[2]:
                statusCode = 2;
                break;
            case statusText[3]:
                statusCode = 3;
                break;
            default:
                statusCode = 0;  
        }
        return statusCode;
    }

  //Set packageInfo to props so props can be accessed within functions
  packageInfo = props;

  //event handler when add item form is submitted
  function AddItem(data){
    let itemName = data.itemName;
    let price = data.price;
    let quantity = data.quantity;
    //alert(data.purchaseOrderStatus);  //for testing

    item = {
      itemName: itemName,
      quantity: quantity,
      price: price,
      purchaseOrderStatus: data.purchaseOrderStatus,
      packageID: packageInfo._id
    };
    itemList.push(item);
    id++;   
    setInventoryList(itemList);
    //clear form and have its default values set
    reset({
      itemName: '',
      quantity: '',
      price: '',
      purchaseOrderStatus: 'not created'
    });
  }

  let axiosArr = [];
  let axiosCall;

  //event handler when items are checked in to write to the database
  function submitInventory(data){
    let checkedInDate = data.checkedInDate; 
    alert(`Checked-In Date: ${checkedInDate} \n Inventory: ${inventoryList.map((item) => capitalize(item.itemName))}`);
    //Note: Need to check whether data has been inputted/changed before a submit
    //TODO: write data to database 

    let headers = {'Content-Type': 'application/json'};

    inventoryList.map((row) => {
      let orderStatus = translatePurchaseOrder(row.purchaseOrderStatus);
      let record = {
        itemName: row.itemName,
        quantity: row.quantity,
        price: row.price,
        purchaseOrderStatus: orderStatus,
        packageId: row.packageID,
        checkInDate: checkedInDate
      };

      axiosCall = axios.post('http://localhost:3005/createItem', record, {headers: headers}) 
      .then((response) => console.log(response.data))
      .catch((error) => console.log(error)); 
      
      axiosArr.push(axiosCall);
    

      //NOTE: This part is not working **
      //axios.post('http://localhost:3005/createItem',
      // {
            // itemName: row.itemName,
            // quantity: row.quantity,
            // price: row.price,
            // purchaseOrderStatus: row.purchaseOrderStatus,
            // packageID: roww.packageID,
            // checkedInDate: checkedInDate
            
        // }) 
        // .then(function (response) {
        //   console.log(response);
        // })
        // .catch(error => {console.log(error)})    
    //)
    });

    Promise.all(axiosArr)
      .then((response) => console.log(response.data))
      .catch((err) => console.log(err));


    //Update checkInStatus for package
    let url = 'http://localhost:3005/updatePackageById/' + packageInfo._id;
    console.log(url);


    //checkInStatus of 1 = checked in; deliveryStatus of 3 = delivered
    axios.patch(url, 
        {
          checkInStatus: 1,
          deliveryStatus: 3
        }
      ) 
      .then(function (response) {
        console.log(response);
      })
      .catch(error => {console.log(error)});   
    

    //clear out items in list upon closing dialog
    //code is here instead of handleClose b/c we want to send data to DB before clearing
    console.log('HERE"S THE ARRAY');
    console.log(axiosArr);
    setInventoryList(dataInit);
  }

  function capitalize(str){
    if (typeof(str) === "string") {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  }

  //TODO: refactor code to section off dialog box into different components
  return (
    <div>    
      <Button variant="contained" color="primary" style={{display: 'block'}} onClick={handleClickOpen}>
        Check In
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Package Check-In"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Checking in for Package #{props._id} (Tracking Number: {props.trackingNum}, Carrier: {props.carrier})
            <section>
              <div>
              {/* ---Form to Add Item--- */}
                <form className="form" onSubmit={handleSubmit(AddItem)}>
                  <FormControl fullWidth>
                    <Controller as=
                      {<TextField
                        required
                        id="outlined-required"
                        label="Item Name"
                        defaultValue=""
                        variant="outlined"
                        style={{margin: 10}}
                      />}
                    name="itemName" 
                    control={control} />
                  </FormControl>
                  <Controller as=
                    {<TextField
                      required
                      id="outlined-required"
                      label="Quantity"
                      defaultValue=""
                      variant="outlined"
                      style={{margin: 10}}
                    />}
                  name="quantity" 
                  control={control}
                  />
                  <Controller as=
                  {<TextField
                    required
                    id="outlined-required"
                    label="Price per Unit"
                    defaultValue=""
                    variant="outlined"
                    style={{margin: 10}}
                  />} 
                  name="price" 
                  control={control}/>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="demo-simple-select-outlined-label">Purchase Order Status</InputLabel>
                    <Controller as=
                      {<Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        defaultValue="not created"
                        required
                        label="Purchase Order Status"
                        >
                        {purchaseOrderStatus.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>}
                    name="purchaseOrderStatus" 
                    control={control}
                    />
                  </FormControl>
                  <Button autoFocus color="primary" type="submit">
                    Add Item
                  </Button>
                </form>
              </div>
            </section>
          </DialogContentText>
        {/* ---Display Table for Items so far--- */}
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Item Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Purchase Order Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventoryList.map((row, index) => (
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
                  <TableCell>{capitalize(row.purchaseOrderStatus)}</TableCell>
                  <TableCell>
                    <IconButton color="secondary" aria-label="delete" onClick={() => {inventoryList.splice(index, 1); setInventoryList(inventoryList);}}>
                      <HighlightOffIcon />
                    </IconButton>
                  </TableCell>            
                </TableRow>
              ))}
            </TableBody>
          </Table>
        {/* ---DatePicker--- */}
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container justify="space-around">
                <form className="form" id="inventory" onSubmit={handleSubmit(submitInventory)}>
                  <Controller as={
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="Checked In Date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />}
                  name="checkedInDate"
                  control={control}
                  />
                </form>
              </Grid>
            </MuiPickersUtilsProvider>
        </DialogContent>
        <DialogActions>
          <Button autoFocus  color="primary" type="submit" form="inventory" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}