import React, { Component } from 'react'
import {connect} from 'react-redux';
import * as mainActions from '../actions/mainActions';
import QRCode from 'qrcode.react'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import { Link } from 'react-router-dom'

import AnnotatedSection from '../components/AnnotatedSection'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faqrcode from '@fortawesome/fontawesome-free-solid/faQrcode'
import faWrench from '@fortawesome/fontawesome-free-solid/faWrench'
import faStar from '@fortawesome/fontawesome-free-solid/faStar'

import {
  Container,
  Button,
  FormGroup,
  Label,
  Input,
  Alert
} from 'reactstrap';

class CombineScan extends Component {

  constructor(props) {
    super(props)
    this.state = {
      address: '',
      productParts: {}
    }
    this.onChange = (address) => this.setState({ address })
  }

  handleMergeProducts = () => {
    var productPartsObject = []
    Object.keys(this.state.productParts).map(inputKey => {
      const value = this.state.productParts[inputKey].value;
      if (value.length > 0) {
        productPartsObject.push(value);
      }
    })
    var customData = [];
    for (var i = 0; i < productPartsObject.length; ++i) {
      this.props.passageInstance.getProductCustomDataById(productPartsObject[i], "latest", {from: this.props.web3Accounts[0], gas:10000000})
        .then(function(result) {
          console.log(customData);
          customData.concat(result);
        });
    }
    var customDataJson = JSON.stringify(customData);
    this.props.passageInstance.combineProducts(productPartsObject, this.props.name, this.props.description, this.props.latitude.toString(), this.props.longitude.toString(), customDataJson, {from: this.props.web3Accounts[0], gas:10000000})
      .then((result) => {
        // product created! ... but we use an event watcher to show the success message, so nothing actuelly happens here after we create a product
      })
  }

  handleSelect = (address, placeId) => {
    this.setState({ address })

    geocodeByAddress(this.state.address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        // TODO: disable the "update" button until a lat/long is returned from the Google Maps API
        return this.props.dispatch(mainActions.updateLatLng(latLng))
      })
      .catch(error => console.error('Error', error))
  }

  appendInput() {
    var newInputKey = `input-${Object.keys(this.state.productParts).length}`; // this might not be a good idea (e.g. when removing then adding more inputs)
    this.setState({ productParts: {...this.state.productParts, [newInputKey]: {key: "", value: ""} }});
  }

  render() {
    const inputProps = {
      value: this.state.address,
      onChange: this.onChange,
      placeholder: "Emplacement (adresse, latitude & longitude, entreprise)"
    }

    return (
      <div>
        {/* Section d'ajout des identifiants */}
        <AnnotatedSection
          annotationContent = {
            <div>
              <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faqrcode}/>
              Identifiants des produits
            </div>
          }
          panelContent = {
            <div>
              <FormGroup>
                {
                  Object.keys(this.state.productParts).map(inputKey =>
                    <FormGroup style={{display:"flex"}} key={inputKey}>
                      Identifiant du produit: 
                      <Input placeholder="0x..." style={{flex: 1}} onChange={(e) => { this.setState({ productParts: {...this.state.productParts, [inputKey]: {...this.state.productParts[inputKey], key: inputKey, value: e.target.value} }})}}/>
                    </FormGroup>
                  )
                }
                <Link to="#" onClick={ () => this.appendInput() }>
                  Ajouter un produit à la combinaison
                </Link>
              </FormGroup>
            </div>
          }
        />

        {/* Section des informations du produit combiné */}       
        <AnnotatedSection
          annotationContent = {
            <div>
              <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faStar}/>
              Informations du produit combiné
            </div>
          }
          panelContent = {
            <div>
              <FormGroup>
                  <Label>Nom</Label>
                  <Input placeholder="Nom du produit" value={this.props.name} onChange={(e) => {this.props.dispatch(mainActions.updateName(e.target.value))}}></Input>
              </FormGroup>
              <FormGroup>
                  <Label>Description</Label>
                  <Input placeholder="Description sommaire du produit" value={this.props.description} onChange={(e) => {this.props.dispatch(mainActions.updateDescription(e.target.value))}}></Input>
              </FormGroup>
              <FormGroup>
                  <Label>Emplacement actuel</Label>
                  <PlacesAutocomplete
                    inputProps={inputProps}
                    onSelect={this.handleSelect}
                    classNames={{input: "form-control"}}
                  />
              </FormGroup>
              <p>*Les certifications et données additionnelles pourront être modifiées après la création.</p>
            </div>
          }
        />

        {/* Section des actions */}
        <AnnotatedSection
          annotationContent = {
            <div>
              <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faWrench}/>
              Actions
            </div>
          }
          panelContent = {
            <div>
              <Button color="primary" onClick={this.handleMergeProducts}>Effectuer la combinaison</Button>
            </div>
          }
        />
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

export default connect(mapStateToProps)(CombineScan);
