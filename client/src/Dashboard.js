import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import PackageList from './PackageList';
import CreateTrackingNum from './CreateTrackingNum';
import InventoryList from './InventoryList';

const useStyles = makeStyles((theme) => ({
    paper: {
      padding: theme.spacing(2),
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
    },
    fixedHeight: {
      height: 400,
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
              <Paper className={classes.paper}>
                <PackageList />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <InventoryList />
              </Paper>
            </Grid>
          </Grid>
    )
}