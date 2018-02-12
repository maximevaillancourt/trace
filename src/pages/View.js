import React, { Component } from 'react'
import PassageMainContractJson from '../../build/contracts/PassageMain.json'
import getWeb3 from '../utils/getWeb3'

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as mainActions from '../actions/mainActions';

class Create extends Component {

  render() {
    const productsList = this.props.products.map((p) =>
      <li key={p.id}>{JSON.stringify(p)}</li>
    );
    
    return (
      <div>
        <p><strong>Derniers produits</strong></p>
        <ul>
            {productsList}
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    products: state.temporaryGodReducer.products
  };
}

export default connect(mapStateToProps)(Create);
