import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { Link } from 'react-router-dom';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import LayersIcon from '@material-ui/icons/Layers';

export function ListItemLink(props) {
  const { icon, primary, to } = props;

  const CustomLink = React.useMemo(
    () =>
      React.forwardRef((linkProps, ref) => (
        <Link ref={ref} to={to} {...linkProps} />
      )),
    [to],
  );

  return (

      <ListItem button component={CustomLink}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={primary} />
      </ListItem>
  
  );
}


export const mainListItems = (
  <div>
    <ListItemLink icon={<DashboardIcon />} primary="Dashboard" to="/"/>
    <ListItemLink icon={<LocalShippingIcon />} primary="Packages" to="/package"/>
    <ListItemLink icon={<LayersIcon />} primary="Inventory" to="/inventory"/>    
  </div>
);