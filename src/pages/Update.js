import React, { Component } from 'react'
import {connect} from 'react-redux';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import { Link } from 'react-router-dom'

import AnnotatedSection from '../components/AnnotatedSection'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faArrowAltCircleUp from '@fortawesome/fontawesome-free-solid/faArrowAltCircleUp'

import {
  Button,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

/*
  Update component
  @description Page component used to update a product's information.
*/
class Update extends Component {

  // TODO: get the product details to make sure we have the right information before showing the Update page
  // TODO: before actually updating the product, check if there is a newer version (i.e. someone else updated the product before us)
  constructor(props) {
    super(props)

    this.state = {
      latitude: '',
      longitude: '',
      address: '',
      customDataInputs: {}
    }
    this.onChange = (address) => this.setState({ address })
  }

  componentDidMount() {
    // shorthand to get the route parameters
    this.params = this.props.match.params;

    // fetch the product's custom data fields then add them to the state
    this.props.passageInstance.getProductCustomDataById(String(this.params.productId).valueOf(), this.params.versionId ? String(this.params.versionId).valueOf() : "latest")
      .then((result) => {
        const customData = JSON.parse(result);
        Object.keys(customData).map(dataKey => {
          const inputKey = this.appendInput();
          this.setState({
            customDataInputs: {...this.state.customDataInputs, [inputKey]: {key: dataKey, value: customData[dataKey]}}
          })
          return false;
        })
      })
      // TODO: display an error upon failure
      .catch((error) => {
        this.setState({
          customDataJson: ""
        })
      })
  }

  // method that adds a new custom data input to the state, which is then
  // reflected on the page by the render() function
  appendInput() {
    var newInputKey = `input-${Object.keys(this.state.customDataInputs).length}`; // this might not be a good idea (e.g. when removing then adding more inputs)
    this.setState({ customDataInputs: {...this.state.customDataInputs, [newInputKey]: {key: "", value: ""} }});
    return newInputKey;
  }

  // method that gets the (lat, lng) pair of the selected location
  // in the location autocompletion search bar
  handleSelect = (address) => {
    this.setState({ address })

    geocodeByAddress(this.state.address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        // TODO: disable the "update" button until a lat/long is returned from the Google Maps API
        this.setState({latitude: latLng.lat, longitude: latLng.lng})
      })
      .catch(error => console.error('Error', error))
  }

  // method that sends the updated data to the smart contract "updateProduct" method
  handleUpdateProduct = () => {
    // generate a 'clean' representation of the custom data
    var customDataObject = {}
    Object.keys(this.state.customDataInputs).map(inputKey => {
      const input = this.state.customDataInputs[inputKey]
      if(input.key.trim() !== "" && input.value.trim() !== ""){
        customDataObject[input.key] = input.value;
      }
      return false;
    })

    // actually call the smart contract method
    this.props.passageInstance.updateProduct(String(this.params.productId).valueOf(), this.state.latitude.toString(), this.state.longitude.toString(), JSON.stringify(customDataObject), {from: this.props.web3Accounts[0], gas:1000000})
      .then((result) => {
        // redirect to the product page upon success
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
        <AnnotatedSection
          annotationContent={
            <div>
              <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faArrowAltCircleUp}/>
              Nouvelles informations
            </div>
          }
          panelContent={
            <div>
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
                  // for every custom data field specified in the component state,
                  // render an input with the appropriate key/value pair
                  Object.keys(this.state.customDataInputs).map(inputKey =>
                    <FormGroup style={{display:"flex"}} key={inputKey}>
                      <Input value={this.state.customDataInputs[inputKey].key} placeholder="Propriété (par exemple, «Couleur»)" style={{flex: 1, marginRight:"15px"}} onChange={(e) => {this.setState({ customDataInputs: {...this.state.customDataInputs, [inputKey]: {...this.state.customDataInputs[inputKey], key: e.target.value} }})}}/>
                      <Input value={this.state.customDataInputs[inputKey].value} placeholder="Valeur (par exemple, «Rouge»)" style={{flex: 1}} onChange={(e) => {this.setState({ customDataInputs: {...this.state.customDataInputs, [inputKey]: {...this.state.customDataInputs[inputKey], value: e.target.value} }})}}/>
                    </FormGroup>
                  )
                }
                <Link to="#" onClick={ () => this.appendInput() }>
                  Ajouter un champ de données personnalisé
                </Link>
              </FormGroup>
              <Button color="primary" onClick={this.handleUpdateProduct}>Créer une nouvelle version</Button>
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

export default connect(mapStateToProps)(Update);
