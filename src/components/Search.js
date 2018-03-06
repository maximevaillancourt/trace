import React, { Component } from 'react'
import {connect} from 'react-redux';
import * as mainActions from '../actions/mainActions';
import { Link } from 'react-router-dom'

import {
  Container,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  Button
} from 'reactstrap';

class Search extends Component {

  render() {
    
    return (
      <div>
        <FormGroup>
          <Label>Identifiant unique du produit à consulter</Label>
          <InputGroup>
            <Input placeholder="0x..." value={this.props.productIdToView} onChange={(e) => {this.props.dispatch(mainActions.updateProductIdToView(e.target.value))}}></Input>
            <InputGroupAddon addonType="append">
              <Link to={"/products/" + this.props.productIdToView}><Button style={{borderBottomLeftRadius:"0", borderTopLeftRadius:"0"}} color="primary">Consulter</Button></Link>
            </InputGroupAddon>
          </InputGroup>
        </FormGroup>        
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    passageInstance: state.temporaryGodReducer.passageInstance,
    productIdToView: state.temporaryGodReducer.productIdToView
  };
}

export default connect(mapStateToProps)(Search);
