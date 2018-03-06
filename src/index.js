import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './Routes';
import configureStore from './store/configureStore';
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.css';
import './App.css'

ReactDOM.render(
  <Provider store={configureStore()}>
    <Routes/>
  </Provider>,
  document.getElementById('root')
);