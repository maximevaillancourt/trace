import React, { Component } from 'react'
import {connect} from 'react-redux';
import * as mainActions from '../actions/mainActions';
import QRCode from 'qrcode.react'

import {
  Container,
  Button,
  FormGroup,
  Label,
  Input,
  Alert
} from 'reactstrap';

class Update extends Component {

  // TODO: get the product details to make sure we have the right information before showing the Update page
  // TODO: before actually updating the product, check if there is a newer version (i.e. someone else updated the product before us)

  componentDidMount() {
    this.params = this.props.match.params;
  }

  handleUpdateProduct = () => {
    console.log(this.params.productId)
    this.props.passageInstance.updateProduct(new String(this.params.productId).valueOf(), this.props.name, this.props.description, this.props.latitude, this.props.longitude, {from: this.props.web3Accounts[0], gas:1000000})
      .then((result) => {
        // redirect to the product page
        this.props.history.push('/products/' + this.params.productId);
      })
  }

  render() {
    return (
      <Container>
        <p><strong>Mise à jour de produit</strong></p>
        <FormGroup>
            <Label>Nom</Label>
            <Input value={this.props.name} onChange={(e) => {this.props.dispatch(mainActions.updateName(e.target.value))}}></Input>
        </FormGroup>
        <FormGroup>
            <Label>Description</Label>
            <Input value={this.props.description} onChange={(e) => {this.props.dispatch(mainActions.updateDescription(e.target.value))}}></Input>
        </FormGroup>
        <FormGroup>
            <Label>Emplacement actuel</Label>
            <Input value={this.props.location} onChange={(e) => {this.props.dispatch(mainActions.updateLatLng(e.target.value))}}></Input>
        </FormGroup>
        <Button color="primary" onClick={this.handleUpdateProduct}>Créer une nouvelle version</Button>
      </Container>
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
    latitude: state.temporaryGodReducer.latitude,
    longitude: state.temporaryGodReducer.longitude,
  };
}

export default connect(mapStateToProps)(Update);
