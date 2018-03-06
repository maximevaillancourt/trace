import React, { Component } from 'react'
import {connect} from 'react-redux';
import * as mainActions from '../actions/mainActions';

import {
  Container,
  Button,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

class CreateCertification extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      imageUrl: '',
    }
  }

  handleCreateNewCertification = () => {
    this.props.passageInstance.createCertification(this.state.name, this.state.imageUrl, {from: this.props.web3Accounts[0], gas:1000000})
      .then((result) => {
        this.props.history.push('/create'); // redirect to the home page
      })
  }

  render() {
    return (
      <div>
        <h2>Nouvelle certification</h2>
        <hr/>
        <FormGroup>
            <Label>Nom</Label>
            <Input value={this.state.name} onChange={(e) => {this.setState({name: e.target.value})}}></Input>
        </FormGroup>
        <FormGroup>
            <Label>URL de l'image de la certification</Label>
            <Input value={this.state.imageUrl} onChange={(e) => {this.setState({imageUrl: e.target.value})}}></Input>
        </FormGroup>
        <Button color="primary" onClick={this.handleCreateNewCertification}>Créer une nouvelle certification</Button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    passageInstance: state.temporaryGodReducer.passageInstance,
    web3Accounts: state.temporaryGodReducer.web3Accounts,
  };
}

export default connect(mapStateToProps)(CreateCertification);
