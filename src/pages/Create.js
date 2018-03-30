import React, { Component } from 'react'
import {connect} from 'react-redux';
import * as mainActions from '../actions/mainActions';
import QRCode from 'qrcode.react'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import { Link } from 'react-router-dom'
import ebayCategoryMap from '../utils/ebay-categories.json'

import AnnotatedSection from '../components/AnnotatedSection'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faStar from '@fortawesome/fontawesome-free-solid/faStar'

import {
  Container,
  Button,
  FormGroup,
  Label,
  Input,
  Alert,
} from 'reactstrap';

/*
  "Create" component
  @description Page component that allows creating a new product
*/
class Create extends Component {

  constructor(props) {
    super(props)

    // initialize the inputs' state
    // TODO: use this internal state for 'name', 'description' and 'lat'+'lng' (instead of the Redux store)
    this.state = {
      address: '',
      availableCertifications: [],
      selectedCertifications: {},
      customDataInputs: {},
      selectedCategories: {},
      ebayCategoryMap: ebayCategoryMap
    }
    this.onChange = (address) => this.setState({ address })
  }

  // when the page is loaded, fetch all available certifications
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

  // method that updates the state when a certification is checked/unchecked
  handleChange = (e) => {
    const certificationId = e.target.name;
    this.setState({selectedCertifications: {...this.state.selectedCertifications, [certificationId]: e.target.checked}})
  }

  // method that sends the new product's information to the smart contract
  handleCreateNewProduct = () => {

    // generate a 'clean' representation of the selected certifications
    const selectedCertifications = this.state.selectedCertifications;
    const certificationsArray = [];
    Object.keys(selectedCertifications).map(key => {
      if(selectedCertifications[key] == true){
        certificationsArray.push(key)
      }
    })

    // generate a 'clean' representation of the custom data
    // TODO: ignore fields with empty values
    var customDataObject = {}
    Object.keys(this.state.customDataInputs).map(inputKey => {
      customDataObject[this.state.customDataInputs[inputKey].key] = this.state.customDataInputs[inputKey].value;
    })

    // generate a 'clean' representation of the categories for use as custom data fields
    Object.keys(this.state.selectedCategories).map(inputKey => {
      const categoryKey = `Catégorie ${inputKey}`
      customDataObject[categoryKey] = this.state.selectedCategories[inputKey].category.categoryName
    })

    // actually call the smart contract method
    this.props.passageInstance.createProduct(this.props.name, this.props.description, this.props.latitude.toString(), this.props.longitude.toString(), certificationsArray, JSON.stringify(customDataObject), {from: this.props.web3Accounts[0], gas:1000000})
      .then((result) => {
        // since we use an event watcher to redirect the user to the newly created product's View page,
        // nothing actually happens here after we create a product
      })
  }

  // method that gets the (lat, lng) pair of the selected location
  // in the location autocompletion search bar
  handleGeoSelect = (address, placeId) => {
    this.setState({ address })

    geocodeByAddress(this.state.address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        // TODO: disable the "update" button until a lat/long is returned from the Google Maps API
        // TODO: place the data in the internal state instead of the Redux instance
        return this.props.dispatch(mainActions.updateLatLng(latLng))
      })
      .catch(error => console.error('Error', error))
  }

  // real ugly method that updates the category tree, coded on a whim
  // TODO: make this pretty, because there's clearly a better way to handle this
  handleCategorySelect = (event, selectedCategoryLevel) => {
    const categoryId = event.target.value;
    const categoryObject = 
      selectedCategoryLevel == 0 ? 
      this.state.ebayCategoryMap.rootCategoryNode.childCategoryTreeNodes.find(category => category.category.categoryId == categoryId)
      :
      this.state.selectedCategories[selectedCategoryLevel].childCategoryTreeNodes.find(category => category.category.categoryId == categoryId)

    const selectedCategories = Object.assign({}, this.state.selectedCategories)
    selectedCategories[parseInt(selectedCategoryLevel)+1] = categoryObject
    
    Object.keys(selectedCategories).map(categoryLevel => {
      var shouldResetCustomDataInputs = false;
      if(parseInt(categoryLevel) > parseInt(selectedCategoryLevel)+1){
        shouldResetCustomDataInputs = true;
        delete selectedCategories[categoryLevel]
      }
      if(shouldResetCustomDataInputs){
        this.setState({ customDataInputs: {} })
      }
    })
    this.setState({selectedCategories: selectedCategories})

    if(!categoryObject.childCategoryTreeNodes){
      this.setCustomAspects(categoryId)
    }
  }

  // retrieves a leaf category's aspects/properties from the eBay API
  // e.g. the "Vehicles > Sedan" category has the following aspects: "Make, Model, Year, Transmission, Engine, Color", etc.
  setCustomAspects = (categoryId) => {
    // TODO: implement a thin back-end server (using Express.js?) to handle the OAuth token request flow.
    // Below is a temporary way to make the request work. Later on, we'll replace that with a call to our thin back-end server
    // to get a token instead of hardcoding a token value like the one below (which is requested manually and expires every 2 hours)
    const token = "v^1.1#i^1#f^0#r^0#p^1#I^3#t^H4sIAAAAAAAAAOVXbWwURRju9fqRUorE4hdc9Fgg0dLdm9293dvbcEeOtkAj9FrurFI0zdzebLv2bveyM0d7+oPSaJEYhRjCDxqSpmoIkfgVPqKBoASRaIKgaETUBL+CoAIxQQkJcXd7lGslUKEiiffnMu+88877PO/zzuyA3rKKmv7F/X9UucqLB3tBb7HLxVaCirLSuVPcxdNLi0CBg2uwd3ZvSZ/75DwM06mMvAzhjKFj5O1Jp3QsO8YQlTV12YBYw7IO0wjLRJFjkaVLZI4BcsY0iKEYKcrbWB+ipCAPoJAQRYkTAUTIsuqXY8aNEMUHYTLghwFO5ZJCImhNY5xFjTomUCchigOsRAOe5qQ4K8qAlwWWCbD+NsrbikysGbrlwgAq7GQrO2vNglSvnSnEGJnECkKFGyMLY9FIY31DU3yeryBWOE9DjECSxaNHdUYSeVthKouuvQ12vOVYVlEQxpQvPLzD6KBy5HIyN5C+w3RCgAE/4IOKHykiK/ATQuVCw0xDcu08bIuWpFXHVUY60UjueoxabCSeRArJj5qsEI31XvuvJQtTmqohM0Q1LIgsjzQ3U+GlsEdLo1ZIx02oILp5WT3tF3hFTCJJpNUgEBCQuPwuw6HyHI/Zps7Qk5rNGPY2GWQBslJGo4kRZKGAGMspqkfNiErsdAr9pMsEArHNruhwCbOkU7eLitIWC15neH36R1YTYmqJLEEjEcZOOPyEKJjJaElq7KQjxLx2enCI6iQkI/t83d3dTDfPGGaHjwOA9T22dElM6URpSOV97V7vwdr1F9CaA0WxWtjyl0kuY+XSYwnVSkDvoMJcQPRzfJ730WmFx1r/ZijA7BvdDhPVHmoioAYDvJgU/H5JUOFEtEc4r1CfnQdKwBydhmYXIpmULVPF0lk2jUwtKfOCyvGSiuikGFRpf1BV6YSQFGlWRQgglEgoQel/0yXj1XlMMTKo2UhpSm7C1D4hSufNZDM0SS6GUinLMF7JXxUktkHeKnh2r48Poh0DW0FgRmNsYTOKkfYZ0DrRbFO7k/VN4dasm/C2KqoFcBiplhy+whgHLoNXKoyJsJE1rdubidqHetzoQrrVJcQ0UilktrI3xcTEHuf/wVF+VVRKSrNobL/dkP2TM/IGhQ3JbQG5pM/VMgKbFTiOE3jA35xU65yixnO37sQaX1UXG5ig5L/w6eEb/QgKFzk/ts+1A/S53rLeUcAH5rCzwMwy9yMl7snTsUYQo0GVwVqHbn3cm4jpQrkM1MziMtcKz5tb2wueXYNPgHtHHl4Vbray4BUGPFdmStk77qliJcBzEisCXmDbwKwrsyXs3SXT5I/KD5x+98eLG1c1tXy8YuAULErvAlUjTi5XaZGlh6IdLzXPvdT53d7AwePbz0judOW+rz2/t056ZfLP5tqdwubq+3+JrrnzDTDt1df2N4gn6P5fXxcWvTe07cW5M2rbBHZt54HyI/uqP1114m3v/g8uzHjnsOdBbhOpO7ttcOUQ139mEv9Uy/MP3GWc8eyuntaxp3J+9ey9x46v+f6hR3dtSf858MwX/eTSwfme2sVTT6+jD53Uqo+uG9h+/oUVgbMXasp3b934Yc3TA7W/mRW1hy58VrP6/KIvF3x+OFrV/9XyGnB+U83j36rc++2tcwY3uwMPTzF2en44dS64fvWRyfcNhZ6VNh1r2FnR0PXTN5/EcWX9uZcvRoulqVM27Kng9KPPqWu27N8wU1s+NFy+vwB47A+BEA8AAA==";
    
    // actually fetch the aspects
    fetch(`https://api.ebay.com/commerce/taxonomy/v1_beta/category_tree/2/get_item_aspects_for_category?category_id=${categoryId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept-Encoding': 'application/gzip'
      },
    })
      .then(response => response.json())
      .then(data => {
        // set data inputs for every aspect
        this.setState({ customDataInputs: {} })
        data.aspects.map(aspect => {
          this.appendInput(aspect.localizedAspectName, "")
        })
      })
  }

  // method that adds a new custom data input to the state, which is then
  // reflected on the page by the render() function
  appendInput(key = "", value = "") {
    var newInputKey = `input-${Object.keys(this.state.customDataInputs).length}`; // this might not be a good idea (e.g. when removing then adding more inputs)
    this.setState({ customDataInputs: {...this.state.customDataInputs, [newInputKey]: {key: key, value: value} }});
  }

  render() {
    const inputProps = {
      value: this.state.address,
      onChange: this.onChange,
      placeholder: "Emplacement (adresse, latitude & longitude, entreprise)"
    }

    return (
      <div>
        <AnnotatedSection
          annotationContent = {
            <div>
              <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faStar}/>
              Informations du produit
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
                    onSelect={this.handleGeoSelect}
                    classNames={{input: "form-control"}}
                  />
              </FormGroup>
              <FormGroup>
                  <Label>Catégorie(s)</Label>
                  <Input type="select" name="select" id="exampleSelect" onChange={(e) => this.handleCategorySelect(e, 0)}>
                    {/* This is the first category dropdown, which represents the 1st level of categories (from the root node) */}
                    <option selected disabled value="" key="none">(sélectionner)</option>
                    {this.state.ebayCategoryMap.rootCategoryNode ?
                      this.state.ebayCategoryMap.rootCategoryNode.childCategoryTreeNodes.map((categoryObject, index) => {
                        return (<option value={categoryObject.category.categoryId} key={index}>{categoryObject.category.categoryName}</option>)
                      })
                      :
                      undefined}
                  </Input>
                  {
                    // these are the lower level categories (level 2, level 3, etc., until a leaf category is reached)
                    Object.keys(this.state.selectedCategories).map(categoryLevel => (
                      this.state.selectedCategories[categoryLevel].childCategoryTreeNodes ?
                        <Input key={categoryLevel} type="select" name="select" id="exampleSelect" onChange={(e) => this.handleCategorySelect(e, categoryLevel)}>
                          <option selected disabled value="" key="none">(sélectionner)</option>
                          {
                            this.state.selectedCategories[categoryLevel].childCategoryTreeNodes.map((categoryObject, index) => {
                              return (<option value={categoryObject.category.categoryId} key={index}>{categoryObject.category.categoryName}</option>)
                            })
                          }
                        </Input>
                        :
                        null
                    ))
                  }
              </FormGroup>
              <FormGroup>
                <Label>
                  Certification(s)
                  <Link style={{marginLeft: "10px"}} to="/createcertification">Créer +</Link>
                </Label>
                <div>
                  {
                    // displays all available certifications
                    this.state.availableCertifications && this.state.availableCertifications.length > 0 ?
                      this.state.availableCertifications.map((certification, index) => 
                        <div key={index}>
                          <input style={{marginRight: "5px"}} onChange={this.handleChange} name={certification.id} type="checkbox"></input>
                          <span>{certification.name}</span>
                        </div>
                      )
                      :
                      <div style={{marginLeft:"15px"}}>
                        Aucune certification existante.
                        <Link style={{marginLeft: "10px"}} to="/createcertification">Créer une certification</Link>
                      </div>
                  }
                </div>
              </FormGroup>
              <FormGroup>
                {
                  // displays all custom data fields from the state
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
              <Button color="primary" onClick={this.handleCreateNewProduct}>Créer un nouveau produit</Button>
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

export default connect(mapStateToProps)(Create);
