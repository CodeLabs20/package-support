import React, {useState, useEffect} from 'react';
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
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  block:{
    width: theme.spacing(8),
    height: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold'
  },
  brown: {
    color: '#FFFFFF',
    background: 'linear-gradient(45deg, #351C15 20%, #FFB500 80%)',
  },
  orange: {
    color: '#FFFFFF',
    background: 'linear-gradient(45deg, #4D148C 55%, #FF6600 5%)',
  },
  darkBlue:{
    color: '#FFFFFF',
    backgroundColor: '#004B87'
  }
}));

export default function PackageList() {
  const dataInit = [{
    _id: '',
    trackingNum: '', 
    deliveryStatus: '',
    checkInStatus: '',
    carrier: ''
  }]  
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
  const deliveryStatus = ['pre transit', 'in transit', 'out for delivery', 'delivered', 'return to sender', 'failure', 'unknown'];
  const checkinStatus = [<ClearIcon fontSize="large" style={{ color: 'red'}}></ClearIcon>, <CheckIcon fontSize="large" style={{ color: '#008000'}}></CheckIcon>];

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
            <TableCell><Typography variant="h6">Tracking Number</Typography></TableCell>
            {/* <TableCell>Carrier</TableCell> */}
            <TableCell><Typography variant="h6">Delivery Status</Typography></TableCell>
            <TableCell><Typography variant="h6">Check-in Status</Typography></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {packageList.map((row, index) => (
            <TableRow key={row._id}>
              <TableCell><Typography variant="body1">{row.trackingNum}</Typography> <ColorBlock text={row.carrier}/></TableCell>
              {/* <TableCell>{capitalize(deliveryStatus[row.deliveryStatus])}</TableCell> */}
              <TableCell><StatusStepper delStatus={row.deliveryStatus}/></TableCell>
              <TableCell>{checkinStatus[row.checkInStatus]}</TableCell>
              <TableCell><InventoryForm _id={row._id} trackingNum={row.trackingNum} carrier={row.carrier}/></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}

export function StatusStepper(props){
  const {delStatus} = props;
  const [activeStep, setActiveStep] = React.useState(delStatus);
  useEffect(() => {
    setActiveStep(delStatus);
  }, [delStatus]);
  
  let deliverySteps = findDeliverySteps(delStatus);
  function findDeliverySteps(pkgStatus){
    let returnSteps;
    const packageTransit = ['pre transit', 'in transit', 'out for delivery', 'delivered'];
    const returnPackage = ['return to sender'];
    const failPackage = ['failure'];
    const unknownPackage = ['unknown'];
    switch(pkgStatus){
      case 4:
        returnSteps = returnPackage;
        break;
      case 5:
        returnSteps = failPackage;
        break;
      case 6:
        returnSteps = unknownPackage;
        break;
      default:
        returnSteps = packageTransit;
    }
    return returnSteps;
  }

  return(
    <Stepper activeStep={activeStep} alternativeLabel>
      {deliverySteps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
        ))}
    </Stepper>
  );
}

export function ColorBlock(props){
  const {text} = props;
  const classes = useStyles();
  const colorChoice = findColorBrand(text);
  function findColorBrand(brand){
    let colorClass;
    let brands = ['FedEx', 'UPS', 'USPS'];
    let allColors = [classes.orange, classes.brown, classes.darkBlue];
    switch(brand){
      case brands[0]:
        colorClass = allColors[0];
        break;
      case brands[1]:
        colorClass = allColors[1];
        break;
      case brands[2]:
        colorClass = allColors[2];
        break;  
      default:
        console.log('No color classes found.');
    }
    return colorClass;
  }

  const colorBlock = clsx(classes.block, colorChoice);

  return(
    <div className={colorBlock}>
      <span className={classes.spacing}>{text}</span>
    </div>
  );
}