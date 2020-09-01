import React, {useState, useEffect} from 'react';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
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
import Button from '@material-ui/core/Button';

export default function EditButton(props){
    const {status, itemId} = props;
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
    const [open, setOpen] = React.useState(false);
    //receive/update new prop value from parent component
    const [value, setValue] = useState(status);
    //useEffect will only execute setValue when the value of status has changes
    useEffect(() => {
      setValue(status);
    }, [status]);
    const {register, control, reset, handleSubmit} = useForm(
      {
        defaultValues: {
          purchaseOrderStatus: value
        }
      }
    );
    
    //to make dialog responsive
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOpen = () => {
    setOpen(true);
    //reset default value from initial useForm()
    reset({purchaseOrderStatus: status});
    console.log(status);
    console.log(value);
  };

  const handleClose = () => {
    setOpen(false);
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

  function updateOrderStatus(data){
      console.log(data.purchaseOrderStatus);
      console.log(itemId);
      let orderStatus = translatePurchaseOrder(data.purchaseOrderStatus);
      axios.patch(`https://pkg-squirrel.herokuapp.com/updateItem/${itemId}`, {
        purchaseOrderStatus: orderStatus
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
              </form>
            </DialogContent>
            <DialogActions>
              <Button autoFocus  color="primary" onClick={handleClose}>
                Cancel
              </Button>
              <Button autoFocus  color="primary" type="submit" form="editItem" onClick={handleClose}>
                Update Purchase Order
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )
}