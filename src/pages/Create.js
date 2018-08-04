import React, { Component } from 'react'
import {connect} from 'react-redux';
import { Link } from 'react-router-dom'
import { Button, FormGroup, Label, Input } from 'reactstrap';
import AnnotatedSection from '../components/AnnotatedSection'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faStar from '@fortawesome/fontawesome-free-solid/faStar'
import ebayCategoryMap from '../utils/ebay-categories.json'

/*
  "Create" component
  @description Page component that allows creating a new product
*/
class Create extends Component {

  constructor(props) {
    super(props)

    // initialize the component's state
    this.state = {
      name: '',
      description: '',
      latitude: '',
      longitude: '',
      address: '',
      availableCertifications: [],
      selectedCertifications: {},
      customDataInputs: {},
      selectedCategories: {},
      buttonDisabled: false,
      ebayCategoryMap: ebayCategoryMap
    }
    this.onChange = (address) => this.setState({ address })
  }

  // when the page is loaded, fetch all available certifications
  componentDidMount(){
    this.props.passageInstance.getActorCertificationsIds({from: this.props.web3Accounts[0]})
      .then((result) => {
        result.map((certificationId) => {
          return this.props.passageInstance.getCertificationById(String(certificationId).valueOf())
            .then((result) => {
              const certification = {
                name: result[0],
                imageUrl: result[1],
                id: certificationId,
              }
              return this.setState({availableCertifications: [...this.state.availableCertifications, certification]})
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
      if(selectedCertifications[key] === true){
        return certificationsArray.push(key)
      }
      return false;
    })

    // generate a 'clean' representation of the custom data
    var customDataObject = {}
    Object.keys(this.state.customDataInputs).map(inputKey => {
      const input = this.state.customDataInputs[inputKey]
      if(input.key.trim() !== "" && input.value.trim() !== ""){
        customDataObject[input.key] = input.value;
      }
      return false;
    })

    // generate a 'clean' representation of the categories for use as custom data fields
    Object.keys(this.state.selectedCategories).map(inputKey => {
      const categoryKey = `Catégorie ${inputKey}`
      return customDataObject[categoryKey] = this.state.selectedCategories[inputKey].category.categoryName
    })

    // actually call the smart contract method
    this.props.passageInstance.createProduct(this.state.name, this.state.description, this.state.latitude.toString(), this.state.longitude.toString(), certificationsArray, JSON.stringify(customDataObject), {from: this.props.web3Accounts[0], gas:1000000})
      .then((result) => {
        // since we use an event watcher to redirect the user to the newly created product's View page,
        // nothing actually happens here after we create a product
      })
  }

  handleGeoSelect = (address) => {
    this.setState({address, buttonDisabled: true})

    geocodeByAddress(this.state.address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        this.setState({latitude: latLng.lat, longitude: latLng.lng, buttonDisabled: false})
      })
      .catch(error => console.error('Error', error))
  }

  // real ugly method that updates the category tree, coded on a whim
  // TODO: improve this -- there's clearly a better way to handle this
  handleCategorySelect = (event, selectedCategoryLevel) => {
    const categoryId = event.target.value;
    const categoryObject = 
      selectedCategoryLevel === 0 ? 
      this.state.ebayCategoryMap.rootCategoryNode.childCategoryTreeNodes.find(category => category.category.categoryId === categoryId)
      :
      this.state.selectedCategories[selectedCategoryLevel].childCategoryTreeNodes.find(category => category.category.categoryId === categoryId)

    const selectedCategories = Object.assign({}, this.state.selectedCategories)
    selectedCategories[parseInt(selectedCategoryLevel, 10)+1] = categoryObject
    
    Object.keys(selectedCategories).map((categoryLevel) => {
      var shouldResetCustomDataInputs = false;
      if(parseInt(categoryLevel, 10) > parseInt(selectedCategoryLevel, 10)+1){
        shouldResetCustomDataInputs = true;
        delete selectedCategories[categoryLevel]
      }
      if(shouldResetCustomDataInputs){
        this.setState({ customDataInputs: {} })
      }
      return false;
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
    const token = ""; // should start with something like "v^1.1#..."
    
    // actually fetch the aspects
    fetch(`https://api.ebay.com/commerce/taxonomy/v1_beta/category_tree/2/get_item_aspects_for_category?category_id=${categoryId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept-Encoding': 'application/gzip'
      },
    })
      .then(response => response.json())
      .then(data => {
        if(!data.aspects){
          console.warn("The request to the eBay API failed. The API token has expired or is invalid.") // TODO: update this upon implementing the OAuth token handler
        } else {
          // set data inputs for every aspect
          this.setState({ customDataInputs: {} })
          data.aspects.map(aspect => {
            return this.appendInput(aspect.localizedAspectName, "")
          })
        }
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
      placeholder: "Location (exact address, latitude & longitude, business)"
    }

    return (
      <div>
        <AnnotatedSection
          annotationContent={
            <div>
              <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faStar}/>
              Product information
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
                    onSelect={this.handleGeoSelect}
                    classNames={{input: "form-control"}}
                  />
              </FormGroup>
              <FormGroup>
                  <Label>Categorie(s)</Label>
                  <Input defaultValue="" type="select" name="select" id="exampleSelect" onChange={(e) => this.handleCategorySelect(e, 0)}>
                    {/* This is the first category dropdown, which represents the 1st level of categories (from the root node) */}
                    <option disabled value="" key="none">(select)</option>
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
                        <Input defaultValue="" key={categoryLevel} type="select" name="select" id="exampleSelect" onChange={(e) => this.handleCategorySelect(e, categoryLevel)}>
                          <option disabled value="" key="none">(select)</option>
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
                        No certification available.
                        <Link style={{marginLeft: "10px"}} to="/createcertification">Create a certification</Link>
                      </div>
                  }
                </div>
              </FormGroup>
              <FormGroup>
                {
                  // displays all custom data fields from the state
                  Object.keys(this.state.customDataInputs).map(inputKey =>
                    <FormGroup style={{display:"flex"}} key={inputKey}>
                      <Input value={this.state.customDataInputs[inputKey].key} placeholder="Property (e.g. 'color')" style={{flex: 1, marginRight:"15px"}} onChange={(e) => {this.setState({ customDataInputs: {...this.state.customDataInputs, [inputKey]: {...this.state.customDataInputs[inputKey], key: e.target.value} }})}}/>
                      <Input value={this.state.customDataInputs[inputKey].value} placeholder="Value (e.g. 'red')" style={{flex: 1}} onChange={(e) => {this.setState({ customDataInputs: {...this.state.customDataInputs, [inputKey]: {...this.state.customDataInputs[inputKey], value: e.target.value} }})}}/>
                    </FormGroup>
                  )
                }
                <Link to="#" onClick={ () => this.appendInput() }>
                  Add a custom data field
                </Link>
              </FormGroup>
              <Button disabled={this.state.buttonDisabled} color="primary" onClick={this.handleCreateNewProduct}>Create product</Button>
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

export default connect(mapStateToProps)(Create);
