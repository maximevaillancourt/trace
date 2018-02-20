import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import App from './App';
import Create from './pages/Create';
import View from './pages/View';
import Search from './pages/Search';
import Update from './pages/Update';

const Routes = () => (
  <Router>
    <div>
      <App>
        <Route exact path="/create" component={Create} />
        <Route exact path="/search" component={Search} />
        <Route exact path="/products/:productId" component={View} />
        {/*
          // TODO: view a specific version
          <Route exact path="/products/:productId/versions/:versionId/" component={View} />
        */}
        <Route exact path="/products/:productId/update" component={Update} />
        {/* TODO: YourProducts.html */}
      </App>
    </div>
  </Router>
);

export default Routes;