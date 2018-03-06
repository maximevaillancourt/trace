import React, { Component } from 'react'
import {connect} from 'react-redux';
import * as mainActions from '../actions/mainActions';
import QRCode from 'qrcode.react'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'

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
    super(props)
    this.state = { address: '' }
    this.onChange = (address) => this.setState({ address })
  }

  handleCreateNewProduct = () => {
    this.props.passageInstance.createProduct(this.props.name, this.props.description, this.props.latitude.toString(), this.props.longitude.toString(), {from: this.props.web3Accounts[0], gas:1000000})
      .then((result) => {
        // product created! ... but we use an event watcher to show the success message, so nothing actuelly happens here after we create a product
      })
  }

  handleSelect = (address, placeId) => {
    this.setState({ address })

    geocodeByAddress(this.state.address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        console.log('Success', latLng)
        return this.props.dispatch(mainActions.updateLatLng(latLng))
      })
      .catch(error => console.error('Error', error))
  }

  render() {
    const inputProps = {
      value: this.state.address,
      onChange: this.onChange,
    }

    return (
      <div>
        <h2>Nouveau produit</h2>
        <hr/>
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
            <PlacesAutocomplete
              inputProps={inputProps}
              onSelect={this.handleSelect}
              classNames={{input: "form-control"}}
            />
        </FormGroup>
        <Button color="primary" onClick={this.handleCreateNewProduct}>Créer un nouveau produit</Button>
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
    latitude: state.temporaryGodReducer.latitude,
    longitude: state.temporaryGodReducer.longitude,
    alert: state.temporaryGodReducer.alert,
  };
}

export default connect(mapStateToProps)(Create);
