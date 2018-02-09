import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import App from './App';
import Create from './Pages/Create';
import View from './Pages/View';
import NotFound from './Pages/NotFound';

const Routes = () => (
 <Router>
    <div>
        <Route path="/" component={App}/>
        <Route exact path="/create" component={Create} />
        {/*
        <Route exact path="/view" component={View} />
        <Route path="*" component={NotFound} />
        */}
    </div>
 </Router>
);

export default Routes;