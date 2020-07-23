import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { Link } from 'react-router-dom';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';

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
    {/* <ListItem button>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem> */}
    <ListItemLink icon={<DashboardIcon />} primary="Dashboard" to="/"/>
    <ListItemLink icon={<LocalShippingIcon />} primary="Packages" to="/package"/>
    {/* <ListItem button component={Link} to="/">
        <ListItemIcon><DashboardIcon /></ListItemIcon>
        <ListItemText primary="DashBoard" />
      </ListItem>
      <ListItem button component={Link} to="/package">
        <ListItemIcon><LocalShippingIcon /></ListItemIcon>
        <ListItemText primary="Packages" />
      </ListItem> */}
  </div>
);