import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
//import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import {Controller, useForm} from 'react-hook-form';
import './App.css';
import { Button } from '@material-ui/core';
import axios from 'axios';
import Link from '@material-ui/core/Link';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Divider from '@material-ui/core/Divider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';  


  
export default function Form() {
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
    }

    ];
    const [open, setOpen] = React.useState(false);
    let dataInit = [{
        itemName: '----', 
        quantity: '----',
        price: '----',
        purchaseOrderStatus: '---'
      }];
      const [inventoryList, setInventoryList] = useState(dataInit);  
      const {register, control, handleSubmit} = useForm();


  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let itemList = [];
  let id = 0;
    
    function AddItem(data){
        let itemName = data.itemName;
        let price = data.price;
        let quantity = data.quantity;
        let purchaseOrderStatus = data.purchaseOrderStatus;
        let item = {
            id: id,
            itemName: itemName,
            quantity: quantity,
            price: price,
            purchaseOrderStatus: purchaseOrderStatus
        };
        itemList.push(item);
        id++;   
        setInventoryList(itemList);
        console.log(itemList);
        //console.log(inventoryList);  
    }

    
    return (
    <div style={{margin: 40}}>    
        <Button variant="contained" color="primary" style={{display: 'block', marginTop: 100}} onClick={handleClickOpen}>
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
            <form className="form" onSubmit={handleSubmit(AddItem)}>
        <FormControl fullWidth>
          <Controller as={<TextField
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
        <Controller as={<TextField
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
        <Controller as={<Select
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
      </DialogContent>
      <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
        
        </div>
        
    );
  }