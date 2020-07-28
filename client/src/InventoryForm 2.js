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

import 'date-fns';

import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

let itemList = [];
let id = 0;
let item;
  
export default function Form() {
  //TODO: change values to status codes
  const checkinStatus = [{
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
    
  const [open, setOpen] = React.useState(false);
  /* let dataInit = [{
    itemName: '----', 
    quantity: '----',
    price: '----',
    purchaseOrderStatus: '---'
  }];
   */    
  let dataInit = []
  const [inventoryList, setInventoryList] = useState(dataInit);  
  const {register, control, handleSubmit} = useForm();
  
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

  //event handler when add item form is submitted
  function AddItem(data){
    let itemName = data.itemName;
    let price = data.price;
    let quantity = data.quantity;
    let purchaseOrderStatus = data.purchaseOrderStatus;
    item = {
      id: id,
      itemName: itemName,
      quantity: quantity,
      price: price,
      purchaseOrderStatus: purchaseOrderStatus || 'not created'
    };
    itemList.push(item);
    id++;   
    setInventoryList(itemList);
    //setInventoryList(itemList);
    console.log(itemList);
    console.log(itemList.length);
    console.log(id);
    //console.log(inventoryList);  
  }

  //event handler when items are checked in to write to the database
  function submitInventory(data){
    let checkedInDate = data.checkedInDate || new Date(Date.now()).toString(); 
    alert(`Checked-In Date: ${checkedInDate} \n Inventory: ${inventoryList.map((item) => item.itemName)}`);
    //Note: Need to check whether data has been inputted/changed before a submit
    //TODO: write data to database 


    //clear out items in list upon closing dialog
    //code is here instead of handleClose b/c we want to send data to DB before clearing
    setInventoryList(dataInit);
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
            Checking in for Package #3 (Tracking Number: ####, Carrier: USPS)
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
                        {checkinStatus.map((option) => (
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
              {inventoryList.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.itemName}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell>{row.purchaseOrderStatus}</TableCell>
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