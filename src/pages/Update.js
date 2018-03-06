import React, { Component } from 'react'
import {connect} from 'react-redux';
import * as mainActions from '../actions/mainActions';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import { Link } from 'react-router-dom'

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
    this.state = {
      address: '',
      customDataInputs: {}
    }
    this.onChange = (address) => this.setState({ address })
  }

  componentDidMount() {
    this.params = this.props.match.params;

    this.props.passageInstance.getProductCustomDataById(String(this.params.productId).valueOf(), this.params.versionId ? String(this.params.versionId).valueOf() : "latest")
      .then((result) => {
        const customData = JSON.parse(result);
        Object.keys(customData).map(dataKey => {
          const inputKey = this.appendInput();
          this.setState({
            customDataInputs: {...this.state.customDataInputs, [inputKey]: {key: dataKey, value: customData[dataKey]}}
          })
        })
      })
      .catch((error) => {
        this.setState({
          customDataJson: ""
        })
      })
  }

  appendInput() {
    var newInputKey = `input-${Object.keys(this.state.customDataInputs).length}`; // this might not be a good idea (e.g. when removing then adding more inputs)
    this.setState({ customDataInputs: {...this.state.customDataInputs, [newInputKey]: {key: "", value: ""} }});
    return newInputKey;
  }

  handleSelect = (address) => {
    this.setState({ address })

    geocodeByAddress(this.state.address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        // TODO: disable the "update" button until a lat/long is returned from the Google Maps API
        return this.props.dispatch(mainActions.updateLatLng(latLng))
      })
      .catch(error => console.error('Error', error))
  }

  handleUpdateProduct = () => {

    var customDataObject = {}
    Object.keys(this.state.customDataInputs).map(inputKey => {
      customDataObject[this.state.customDataInputs[inputKey].key] = this.state.customDataInputs[inputKey].value;
    })

    this.props.passageInstance.updateProduct(String(this.params.productId).valueOf(), this.props.latitude.toString(), this.props.longitude.toString(), JSON.stringify(customDataObject), {from: this.props.web3Accounts[0], gas:1000000})
      .then((result) => {
        // redirect to the product page
        this.props.history.push('/products/' + this.params.productId);
      })
  }

  render() {
    const inputProps = {
      value: this.state.address,
      onChange: this.onChange,
      placeholder: "Emplacement (adresse, lat/long)"
    }

    return (
      <div>
        <p><strong>Mise à jour de produit</strong></p>
        <FormGroup>
            <Label>Emplacement actuel</Label>
            <PlacesAutocomplete
              inputProps={inputProps}
              onSelect={this.handleSelect}
              classNames={{input: "form-control"}}
            />
        </FormGroup>
        <FormGroup>
          {
            Object.keys(this.state.customDataInputs).map(inputKey =>
              <FormGroup style={{display:"flex"}} key={inputKey}>
                <Input value={this.state.customDataInputs[inputKey].key} placeholder="key" style={{flex: 1}} onChange={(e) => {this.setState({ customDataInputs: {...this.state.customDataInputs, [inputKey]: {...this.state.customDataInputs[inputKey], key: e.target.value} }})}}/>
                <Input value={this.state.customDataInputs[inputKey].value} placeholder="value" style={{flex: 1}} onChange={(e) => {this.setState({ customDataInputs: {...this.state.customDataInputs, [inputKey]: {...this.state.customDataInputs[inputKey], value: e.target.value} }})}}/>
              </FormGroup>
            )
          }
          <Link to="#" onClick={ () => this.appendInput() }>
            Ajouter un champ de données personnalisé
          </Link>
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
