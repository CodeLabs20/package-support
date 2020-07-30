import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import PackageList from './PackageList';
import CreateTrackingNum from './CreateTrackingNum';
import InventoryList from './InventoryList';
import Title from './Title';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
    paper: {
      padding: theme.spacing(2),
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
    },
    fixedHeight: {
      height: 275,
    },
  }));



export default function Dashboard(){
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    return(
        <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={fixedHeightPaper}>
                <CreateTrackingNum />
              </Paper>
            </Grid>
            <Grid item xs={12}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Title>Package List</Title>
              </AccordionSummary>
              <AccordionDetails>
                <PackageList />
              </AccordionDetails>
            </Accordion>
            </Grid>
            <Grid item xs={12}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Title>Inventory List</Title>
              </AccordionSummary>
              <AccordionDetails>
                <InventoryList />
              </AccordionDetails>
            </Accordion>
            </Grid>
          </Grid>
    );
}