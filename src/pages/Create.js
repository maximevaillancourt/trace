import React, { Component } from 'react'
import PassageMainContractJson from '../../build/contracts/PassageMain.json'
import getWeb3 from '../utils/getWeb3'

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as mainActions from '../actions/mainActions';

class Create extends Component {

  handleCreateNewProduct = () => {
    this.props.passageInstance.createProduct(this.props.name, this.props.description, this.props.location, {from: this.props.web3Accounts[0], gas:3000000})
      .then((result) => {
        // success! display a success message?
      })
  }

  render() {
    return (
      <div>
        <p><strong>Nouveau produit</strong></p>
        <div>
            <label>Nom</label>
            <input value={this.props.name} onChange={(e) => {this.props.dispatch(mainActions.updateName(e.target.value))}}></input>
        </div>
        <div>
            <label>Description</label>
            <input value={this.props.description} onChange={(e) => {this.props.dispatch(mainActions.updateDescription(e.target.value))}}></input>
        </div>
        <div>
            <label>Emplacement actuel</label>
            <input value={this.props.location} onChange={(e) => {this.props.dispatch(mainActions.updateLocation(e.target.value))}}></input>
        </div>
        <button onClick={this.handleCreateNewProduct}>Créer un nouveau produit</button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    passageInstance: state.temporaryGodReducer.passageInstance,
    products: state.temporaryGodReducer.products,
    web3Accounts: state.temporaryGodReducer.web3Accounts,
    name: state.temporaryGodReducer.name,
    description: state.temporaryGodReducer.description,
    location: state.temporaryGodReducer.location,
  };
}

export default connect(mapStateToProps)(Create);
