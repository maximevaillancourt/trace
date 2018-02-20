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

class Create extends Component {

  handleCreateNewProduct = () => {
    this.props.passageInstance.createProduct(this.props.name, this.props.description, this.props.location, {from: this.props.web3Accounts[0], gas:1000000})
      .then((result) => {
        // product created! ... but we use an event watcher to show the success message, so nothing actuelly happens here after we create a product
      })
  }

  render() {
    return (
      <Container>
        <p><strong>Nouveau produit</strong></p>
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
            <Input value={this.props.location} onChange={(e) => {this.props.dispatch(mainActions.updateLocation(e.target.value))}}></Input>
        </FormGroup>
        <Button color="primary" onClick={this.handleCreateNewProduct}>Créer un nouveau produit</Button>
        {this.props.alert && this.props.alert.visible ?
          <div style={{paddingTop: "15px"}}>
            <Alert color={this.props.alert.color}>
              {this.props.alert.content}
               <QRCode value={this.props.alert.content}/>
            </Alert>
          </div> :
          null
        }
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
    location: state.temporaryGodReducer.location,
    alert: state.temporaryGodReducer.alert,
  };
}

export default connect(mapStateToProps)(Create);
