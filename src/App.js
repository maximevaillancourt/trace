import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PassageMainContractJson from '../build/contracts/PassageMain.json'
import getWeb3 from './utils/getWeb3'

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as mainActions from './actions/mainActions';

class App extends Component {

  componentWillMount() {
    getWeb3
      .then(results => {
        this.props.dispatch(mainActions.setWeb3Instance(results.web3))
        this.instantiateContract()
      })
      .catch((err) => {
        console.error(err)
        console.log('Error finding web3.')
      })
  }

  instantiateContract() {
    const contract = require('truffle-contract')
    const PassageContract = contract(PassageMainContractJson)
    PassageContract.setProvider(this.props.web3.currentProvider)

    this.props.web3.eth.getAccounts((error, accounts) => {
      PassageContract.deployed().then((instance) => {
        this.props.dispatch(mainActions.setPassageInstance(instance))
        this.props.dispatch(mainActions.setWeb3Accounts(accounts))

        const _this = this; // TODO: fix this js scope mess (let? arrow function?)
        const event = instance.ProductCreated({fromBlock: 0, toBlock: 'latest'}) // TODO: extract event watchers into a new method/class?
        event.watch(function(error, result){
          if (!error){
            const newProduct = {
              id: result.args.newProductId,
              name: result.args.name,
              description: result.args.description,
              location: result.args.location,
            }
            return _this.props.dispatch(mainActions.addProduct(newProduct))
          } else {
            console.log(error);
          }
        });
      })
    })
  }

  render() {
    return (
      <div>
        <p><b><Link to="/">Passage</Link></b></p>
        <p><Link to="/create">Create a product</Link></p>
        <p><Link to="/view">View a product</Link></p>
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    web3: state.temporaryGodReducer.web3
  };
}

export default connect(mapStateToProps)(App);

