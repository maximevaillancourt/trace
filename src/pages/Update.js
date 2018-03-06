import React, { Component } from 'react'
import {connect} from 'react-redux';
import * as mainActions from '../actions/mainActions';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'

import {
  Container,
  Button,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

class Update extends Component {

  // TODO: get the product details to make sure we have the right information before showing the Update page
  // TODO: before actually updating the product, check if there is a newer version (i.e. someone else updated the product before us)

  constructor(props) {
    super(props)
    this.state = { address: '' }
    this.onChange = (address) => this.setState({ address })
  }

  componentDidMount() {
    this.params = this.props.match.params;
  }

  handleSelect = (address) => {
    this.setState({ address })

    geocodeByAddress(this.state.address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        console.log('Success', latLng)
        return this.props.dispatch(mainActions.updateLatLng(latLng))
      })
      .catch(error => console.error('Error', error))
  }

  handleUpdateProduct = () => {
    console.log(this.params.productId)
    this.props.passageInstance.updateProduct(String(this.params.productId).valueOf(), this.props.name, this.props.description, this.props.latitude.toString(), this.props.longitude.toString(), {from: this.props.web3Accounts[0], gas:1000000})
      .then((result) => {
        // redirect to the product page
        this.props.history.push('/products/' + this.params.productId);
      })
  }

  render() {
    const inputProps = {
      value: this.state.address,
      onChange: this.onChange,
    }

    return (
      <div>
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
            <PlacesAutocomplete
              inputProps={inputProps}
              onSelect={this.handleSelect}
              classNames={{input: "form-control"}}
            />
        </FormGroup>
        <Button color="primary" onClick={this.handleUpdateProduct}>Créer une nouvelle version</Button>
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
  };
}

export default connect(mapStateToProps)(Update);
