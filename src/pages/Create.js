import React, { Component } from 'react'
import {connect} from 'react-redux';
import * as mainActions from '../actions/mainActions';
import QRCode from 'qrcode.react'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import { Link } from 'react-router-dom'

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
    this.state = {
      address: '',
      availableCertifications: [],
      selectedCertifications: {},
      customDataInputs: {},
    }
    this.onChange = (address) => this.setState({ address })
  }

  componentDidMount(){
    this.props.passageInstance.getAllCertificationsIds()
      .then((result) => {
        result.map((certificationId) => {
          this.props.passageInstance.getCertificationById(String(certificationId).valueOf())
            .then((result) => {
              const certification = {
                name: result[0],
                imageUrl: result[1],
                id: certificationId,
              }
              this.setState({availableCertifications: [...this.state.availableCertifications, certification]})
            });
        });
    })
  }

  handleChange = (e) => {
    const certificationId = e.target.name;
    this.setState({selectedCertifications: {...this.state.selectedCertifications, [certificationId]: e.target.checked}})
  }

  handleCreateNewProduct = () => {
    const selectedCertifications = this.state.selectedCertifications;
    const certificationsArray = [];
    Object.keys(selectedCertifications).map(key => {
      if(selectedCertifications[key] == true){
        certificationsArray.push(key)
      }
    })

    var customDataObject = {}
    Object.keys(this.state.customDataInputs).map(inputKey => {
      customDataObject[this.state.customDataInputs[inputKey].key] = this.state.customDataInputs[inputKey].value;
    })
    this.props.passageInstance.createProduct(this.props.name, this.props.description, this.props.latitude.toString(), this.props.longitude.toString(), certificationsArray, JSON.stringify(customDataObject), {from: this.props.web3Accounts[0], gas:1000000})
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
    var newInputKey = `input-${Object.keys(this.state.customDataInputs).length}`; // this might not be a good idea (e.g. when removing then adding more inputs)
    this.setState({ customDataInputs: {...this.state.customDataInputs, [newInputKey]: {key: "", value: ""} }});
  }

  render() {
    const inputProps = {
      value: this.state.address,
      onChange: this.onChange,
      placeholder: "Emplacement (adresse, lat/long)"
    }

    return (
      <div>
        <h2>Nouveau produit</h2>
        <hr/>
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
        <FormGroup>
          <Label>
            Certification(s)
            <Link style={{marginLeft: "10px"}} to="/createcertification">créer +</Link>
          </Label>
          <div>
            {this.state.availableCertifications && this.state.availableCertifications.length > 0 ?
              this.state.availableCertifications.map((certification, index) => 
                <div key={index}>
                  <input style={{marginRight: "5px"}} onChange={this.handleChange} name={certification.id} type="checkbox"></input>
                  <span>{certification.name}</span>
                </div>
              )
              :
              "Aucune certification existante"}
          </div>
        </FormGroup>
        <FormGroup>
          {
            Object.keys(this.state.customDataInputs).map(inputKey =>
              <FormGroup style={{display:"flex"}} key={inputKey}>
                <Input placeholder="key" style={{flex: 1}} onChange={(e) => {this.setState({ customDataInputs: {...this.state.customDataInputs, [inputKey]: {...this.state.customDataInputs[inputKey], key: e.target.value} }})}}/>
                <Input placeholder="value" style={{flex: 1}} onChange={(e) => {this.setState({ customDataInputs: {...this.state.customDataInputs, [inputKey]: {...this.state.customDataInputs[inputKey], value: e.target.value} }})}}/>
              </FormGroup>
            )
          }
          <Link to="#" onClick={ () => this.appendInput() }>
            Ajouter un champ de données personnalisé
          </Link>
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
