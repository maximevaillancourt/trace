import React, { Component } from 'react'
import {connect} from 'react-redux';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import { Link } from 'react-router-dom'

import AnnotatedSection from '../components/AnnotatedSection'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faqrcode from '@fortawesome/fontawesome-free-solid/faQrcode'
import faWrench from '@fortawesome/fontawesome-free-solid/faWrench'
import faStar from '@fortawesome/fontawesome-free-solid/faStar'

import {
  Button,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

class CombineScan extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      description: '',
      latitude: '',
      longitude: '',
      address: '',
      buttonDisabled: false,
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
      return false;
    })
    /* TODO Implement customdata merging with some choosing UI
    var customData = [];
    for (var i = 0; i < productPartsObject.length; ++i) {
      this.props.passageInstance.getProductCustomDataById(productPartsObject[i], "latest", {from: this.props.web3Accounts[0], gas:10000000})
        .then(function(result) {
          console.log(customData);
          customData.concat(result);
        });
    }
    var customDataJson = JSON.stringify(customData);*/
    this.props.passageInstance.combineProducts(productPartsObject, this.state.name, this.state.description, this.state.latitude.toString(), this.state.longitude.toString(), {from: this.props.web3Accounts[0], gas:1000000})
      .then((result) => {
        // product created! ... but we use an event watcher to show the success message, so nothing actuelly happens here after we create a product
      })
  }

  handleSelect = (address) => {
    this.setState({address, buttonDisabled: true})

    geocodeByAddress(this.state.address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        this.setState({latitude: latLng.lat, longitude: latLng.lng, buttonDisabled: false})
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
      placeholder: "Location (exact address, latitude & longitude, business)"
    }

    return (
      <div>
        <AnnotatedSection
          annotationContent={
            <div>
              <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faqrcode}/>
              Product identifiers
            </div>
          }
          panelContent={
            <div>
              <FormGroup>
                {
                  Object.keys(this.state.productParts).map(inputKey =>
                    <FormGroup style={{display:"flex"}} key={inputKey}>
                      Product identifier: 
                      <Input placeholder="0x..." style={{flex: 1}} onChange={(e) => { this.setState({ productParts: {...this.state.productParts, [inputKey]: {...this.state.productParts[inputKey], key: inputKey, value: e.target.value} }})}}/>
                    </FormGroup>
                  )
                }
                <Link to="#" onClick={ () => this.appendInput() }>
                  Add a product to combine
                </Link>
              </FormGroup>
            </div>
          }
        />

        <AnnotatedSection
          annotationContent={
            <div>
              <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faStar}/>
              Combined product data
            </div>
          }
          panelContent={
            <div>
              <FormGroup>
                  <Label>Name</Label>
                  <Input placeholder="Product name" value={this.state.name} onChange={(e) => {this.setState({name: e.target.value})}}></Input>
              </FormGroup>
              <FormGroup>
                  <Label>Description</Label>
                  <Input placeholder="Product description" value={this.state.description} onChange={(e) => {this.setState({description: e.target.value})}}></Input>
              </FormGroup>
              <FormGroup>
                  <Label>Current location</Label>
                  <PlacesAutocomplete
                    inputProps={inputProps}
                    onSelect={this.handleSelect}
                    classNames={{input: "form-control"}}
                  />
              </FormGroup>
              <p>Certifications and custom data can be modified after the merge.</p>
            </div>
          }
        />

        <AnnotatedSection
          annotationContent={
            <div>
              <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faWrench}/>
              Actions
            </div>
          }
          panelContent={
            <div>
              <Button disabled={this.state.buttonDisabled} color="primary" onClick={this.handleMergeProducts}>Combine products</Button>
            </div>
          }
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    passageInstance: state.reducer.passageInstance,
    web3Accounts: state.reducer.web3Accounts
  };
}

export default connect(mapStateToProps)(CombineScan);
