import React, { Component } from 'react'
import {connect} from 'react-redux';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import { Link } from 'react-router-dom'

import AnnotatedSection from '../components/AnnotatedSection'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faUngroup from '@fortawesome/fontawesome-free-solid/faObjectUngroup'
import faWrench from '@fortawesome/fontawesome-free-solid/faWrench'

import CreateProduct from './Create'

import {
  Button,
  FormGroup,
  Alert
} from 'reactstrap';

class SplitProduct extends Component {

  // TODO: get the product details to make sure we have the right information before showing the Update page
  // TODO: before actually updating the product, check if there is a newer version (i.e. someone else updated the product before us)

  constructor(props) {
    super(props)
    this.state = {
      latitude: '',
      longitude: '',
      buttonDisabled: false,
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
          return this.setState({
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
    this.setState({address, buttonDisabled: true})

    geocodeByAddress(this.state.address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        this.setState({latitude: latLng.lat, longitude: latLng.lng, buttonDisabled: false})
      })
      .catch(error => console.error('Error', error))
  }

  handleUpdateProduct = () => {

    var customDataObject = {}
    Object.keys(this.state.customDataInputs).map(inputKey => {
      return customDataObject[this.state.customDataInputs[inputKey].key] = this.state.customDataInputs[inputKey].value;
    })

    this.props.passageInstance.updateProduct(String(this.params.productId).valueOf(), this.state.latitude.toString(), this.state.longitude.toString(), JSON.stringify(customDataObject), {from: this.props.web3Accounts[0], gas:1000000})
      .then((result) => {
        // redirect to the product page
        return this.props.history.push('/products/' + this.params.productId);
      })
  }

  render() {
    return (
      <div>
        <Alert color="warning">The "Split product" feature is not ready. Use this page with caution.</Alert>
        {/* Section des produits */}
        <AnnotatedSection
          annotationContent={
            <div>
              <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faUngroup}/>
              By-products
            </div>
          }
          panelContent={
            <div>
              <FormGroup>
                {
                  <CreateProduct/>
                }
                <Link to="#" onClick={ () => this.appendInput() }>
                  Add a by-product
                </Link>
              </FormGroup>
            </div>
          }
        />

        {/* Section des actions */}
        <AnnotatedSection
          annotationContent={
            <div>
              <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faWrench}/>
              Actions
            </div>
          }
          panelContent={
            <div>
              <Button disabled={this.state.buttonDisabled} color="primary" onClick={this.handleCreateNewProduct}>Split product</Button>
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

export default connect(mapStateToProps)(SplitProduct);
