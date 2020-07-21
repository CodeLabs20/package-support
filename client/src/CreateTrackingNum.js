import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {Controller, useForm} from 'react-hook-form';
import './App.css';
import axios from 'axios';
import Title from './Title';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import "./CreateTrackingNum.css"

const carriers = [
    {
        value: 'FedEx',
        label: 'FedEx' //change to image + text in the future,
    },
    {
        value: 'UPS',
        label: 'UPS',
    },
    {
        value: 'USPS',
        label: 'USPS',
    }
];
  
export default function CreateTrackingNum() {
    const [deliveryStatus, setDeliveryStatus] = useState('');
    const {register, control, handleSubmit} = useForm();

    function submitTrackingForm(data){
        //Testing purposes
        //alert(`TRACKING NUMBER: ${data.trackingNumber} \n CARRIER: ${data.carrier}`);
        //Testing data
        //TRKNUM: 9241990990092105153169
        //CR: USPS
        axios.post('http://localhost:3005/getDeliveryStatus', {
            trackingNum: data.trackingNumber,
            carrier: data.carrier
        })
        .then((response) => {
            setDeliveryStatus(response.data);
            //need to seperate these in the future
            if(response.data != ''){
                writeToDB(data.trackingNumber, data.carrier, response.data);
            }
        })
        .catch((err) => console.log(err));
    }

    function writeToDB(trackingNum, carrier, deliveryStatus){
        let deliveryCode = translateDeliveryStatus(deliveryStatus);
        axios.post('http://localhost:3005/createPackage', {
            trackingNum: trackingNum,
            carrier: carrier,
            deliveryStatus: deliveryCode
        });
    }

    function translateDeliveryStatus(status){
        let statusCode;
        const statusText = ['pre_transit', 'in_transit', 'out_for_delivery', 'delivered', 'return_to_sender', 'failure', 'unknown'];
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
            case statusText[4]:
                statusCode = 4;
                break;
            case statusText[5]:
                statusCode = 5;
                break;
            default:
                statusCode = 6;  
        }
        return statusCode;
    }
  
    return (
    <div>
        <h4 style={{marginTop: 60, fontSize: 60}} id="createtitle">
            Create Tracking Number
        </h4>    
        <form className="form" onSubmit={handleSubmit(submitTrackingForm)} style={{marginTop: 70}}>
            <section>
                <Controller as={
                    <TextField 
                    label="Tracking Number" variant="outlined" style={{minWidth: 320}}
                    />
                    } 
                    name="trackingNumber" 
                    control={control} 
                    defaultValue="" />
            {/* </section>
            <section> */}
                <FormControl variant="outlined" style={{minWidth: 120, marginLeft: 40}}>
                <InputLabel id="select-outlined-label">Carrier</InputLabel>
                <Controller as={
                    <Select
                        labelId="select-outlined-label"
                    >
                        {carriers.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>    
                } 
                name="carrier" 
                control={control}
                defaultValue=""/>
                </FormControl>

                <Button variant="contained" color="primary" style={{marginLeft: 40}} type="submit">
                Submit
                </Button>
            </section>


        </form>
        {/* need to comment out */}
        <h2 style={{marginTop: 40}}>DELIVERY STATUS: {deliveryStatus}</h2>
        </div>
    );
  }