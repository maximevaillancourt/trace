import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './Routes';
import configureStore from './store/configureStore';
import { Provider } from 'react-redux'

ReactDOM.render(
  <Provider store={configureStore()}>
    <Routes/>
  </Provider>,
  document.getElementById('root')
);