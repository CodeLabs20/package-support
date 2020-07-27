import React, {useState, useEffect} from 'react';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
//import {checkinStatus} from './InventoryForm';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import {Controller, useForm} from 'react-hook-form';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import { green } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';

export default function EditButton(props){
    const {status, itemId} = props;
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
    const {register, control, handleSubmit} = useForm({
        defaultValues:{
            purchaseOrderStatus: status
        }
    });
    //to make dialog responsive
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function updateOrderStatus(data){
      console.log(data.purchaseOrderStatus);
      console.log(itemId);
      axios.patch(`http://localhost:3005/updateItem/${itemId}`, {
        purchaseOrderStatus: data.purchaseOrderStatus
      })
      .then((response) => console.log(JSON.stringify(response.data)))
      .catch((err) => console.log(err));
  }

    return(
        <div>    
          <IconButton color="primary" aria-label="delete" onClick={handleClickOpen}>
            <EditIcon />
          </IconButton>
          <Dialog
            fullWidth={true}
            maxWidth="sm"
            open={open}
            onClose={handleClose}
          >
            <DialogTitle>{"Editing Item"}</DialogTitle>
            <DialogContent>
              <form className="form" id="editItem" onSubmit={handleSubmit(updateOrderStatus)}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="demo-simple-select-outlined-label">Purchase Order Status</InputLabel>
                  <Controller as=
                    {<Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
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
              </form>
            </DialogContent>
            <DialogActions>
              <Button autoFocus  color="primary" type="submit" form="editItem" onClick={handleClose}>
                Change
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )
}