import React, { Component } from 'react'
import PassageMainContractJson from '../../build/contracts/PassageMain.json'
import getWeb3 from '../utils/getWeb3'

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as mainActions from '../actions/mainActions';

import {
  Container,
  Button,
  FormGroup,
  Label,
  Input,
  Alert
} from 'reactstrap';

class Create extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    this.state = {
      success: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  handleCreateNewProduct = () => {
    this.props.passageInstance.createProduct(this.props.name, this.props.description, this.props.location, {from: this.props.web3Accounts[0], gas:1000000})
      .then((result) => {
        this.setState({success: true})
        setTimeout(() => {
          this.setState({success: false})
        }, 5000)
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
        {this.state.success ? <div style={{paddingTop: "15px"}}><Alert>Produit créé avec succès.</Alert></div> : null }
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
  };
}

export default connect(mapStateToProps)(Create);
