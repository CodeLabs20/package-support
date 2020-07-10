import React from 'react';
import './App.css';
import Package from './Package';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

export default class App extends React.Component{
    render(){
        return(
            <React.Fragment>
                <div className='app-header'>Package Support</div>
                <Router>
                    <nav>
                        <ul>
                            <li><Link to='/'>Dashboard</Link></li>
                            <li><Link to='/track-package'>Track Package</Link></li>
                        </ul>
                    </nav>

                    <Switch>
                        <Route path='/track-package'><Package /></Route>
                    </Switch>
                </Router>
            </React.Fragment>    
        )
    }
}