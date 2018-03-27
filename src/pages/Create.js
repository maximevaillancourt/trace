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

class Create extends Component {

  constructor(props) {
    super(props)
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

    Object.keys(this.state.selectedCategories).map(inputKey => {
      const categoryKey = `Catégorie ${inputKey}`
      customDataObject[categoryKey] = this.state.selectedCategories[inputKey].category.categoryName
    })

    this.props.passageInstance.createProduct(this.props.name, this.props.description, this.props.latitude.toString(), this.props.longitude.toString(), certificationsArray, JSON.stringify(customDataObject), {from: this.props.web3Accounts[0], gas:1000000})
      .then((result) => {
        // product created! ... but we use an event watcher to show the success message, so nothing actuelly happens here after we create a product
      })
  }

  handleGeoSelect = (address, placeId) => {
    this.setState({ address })

    geocodeByAddress(this.state.address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        // TODO: disable the "update" button until a lat/long is returned from the Google Maps API
        return this.props.dispatch(mainActions.updateLatLng(latLng))
      })
      .catch(error => console.error('Error', error))
  }

  handleCategorySelect = (event, selectedCategoryLevel) => {
    const categoryId = event.target.value;
    const categoryObject = 
      selectedCategoryLevel == 0 ? 
      this.state.ebayCategoryMap.rootCategoryNode.childCategoryTreeNodes.find(category => category.category.categoryId == categoryId)
      :
      this.state.selectedCategories[selectedCategoryLevel].childCategoryTreeNodes.find(category => category.category.categoryId == categoryId)

    const deepestCategory = categoryObject;

    const selectedCategories = Object.assign({}, this.state.selectedCategories)
    selectedCategories[parseInt(selectedCategoryLevel)+1] = categoryObject
    
    Object.keys(selectedCategories).map(categoryLevel => {
      if(parseInt(categoryLevel) > parseInt(selectedCategoryLevel)+1){
        delete selectedCategories[categoryLevel]
      }
    })
    this.setState({selectedCategories: selectedCategories})
  }

  // TODO: initialize custom data keys based on selected leaf category
  setCustomAspects = (categoryId) => {
    const token = "v^1.1#i^1#f^0#p^1#I^3#r^0#t^H4sIAAAAAAAAAOVXbWwURRju9eMQChiJYFNAjwVTLeze7N72PhZ6cKVFGukH3FGxasjc7ixderd72ZnjeqVK04TGCBLBWrTG0GhjYqJRDCIo1WgNJMoPxCAJEY1GEdDoD4lGNMTZvaNcK+GzCIn7ZzMz77zzPM/7sTug0zm+vHtp9x+THOPy+ztBZ77DwReD8c6iuZML8kuL8kCOgaO/c05nYVfByQUYxmMJaQXCCUPHyNUWj+lYsicrmaSpSwbEGpZ0GEdYIrIUDtUtkwQOSAnTIIZsxBhXbXUlA4Hq8Xh9Ub8fRD2ioNJZ/bzPiFHJBKACfEAIeCt8SBEEL13HOIlqdUygTioZAfB+FnhYgY/woiTwkhjgPILYzLiakIk1Q6cmHGCCNlzJ3mvmYL00VIgxMgl1wgRrQ0vCDaHa6pr6yAJ3jq9gVocwgSSJR44WGwpyNcFYEl36GGxbS+GkLCOMGXcwc8JIp1LoPJhrgG9LHQjwCpBlPiCgKBJFcUykXGKYcUgujcOa0RRWtU0lpBONpC+nKFUjuhbJJDuqpy5qq13Wa3kSxjRVQ2YlU1MVejjU2MgE62CbFkdNkI2YUEZsuGoVyyuqVxahWMH6ZeANQBlmT8m4ymo86pjFhq5olmLYVW+QKkQho9HC8DnCUKMGvcEMqcSCk2vnPS8gEJqtiGZCmCQtuhVUFKcquOzh5eUf3k2IqUWTBA17GL1g60NrKpHQFGb0op2I2dxpw5VMCyEJye1OpVJcysMZ5hq3AADvXlW3LCy3oDhkMrZWrVN77fIbWM2mIiO6E2sSSScoljaaqBSAvoYJ0iIWRH9W95GwgqNn/zWRw9k9shzGqjy8CKKoKkf5CkQ7TcA3FuURzGao28KBojDNxqHZikgiZqWpTPMsGUempkieClXw+FXEKt6AyooBVWWjFYqX5VWEAELRqBzw/2+q5ErzPCwbCdRoxDQ5PVbZPjaZ7jGVRmiSdFUyTcdhFIvR15Um/kWpYovqDSdp1fpVEbV8YOoEJjTOSm9ONuJuA9K+Zk2ttlFfF2+Nfg9vqdBSghmmmpL5kHE2XQ6vkzkTYSNp0m8412C19ojRinRaK8Q0YjFkNvHXpcSYNvWb0dAvykqOaVTG1bcas6vplNeY2JDcXMqFXY5Vo2nzFQLvFQUeBK6L22I7qJH0f9CxriqqSw1MkHIDfkDcI+9CwTz74bscg6DLsZdep+gVhuXngvudBSsLCyYyWCOIw1BXokYbp0GVw9oanf7qm4hrRekE1Mx8p+OR6acX/p1zC+t/DJQM38PGF/DFOZcyMOPCShF/+12TeD/wCDxPYykGmsHsC6uF/LTCO7cLju8Pu2ev/2LjoQ27Po2+jra8+S6YNGzkcBTl0fTIY6cdKWv8JPLXvkM7v5o1dOLDJ+8+crZs872+1l+KfJ+/dOj3F7a8VjNw2wbnue3PSr1H8xc+PW/9gPzBDz/3vne0Ax5I4RWTnQ3Vi747s/9R2PN4V9m4A59NeGoob8ee3rqeg/P25IN7nK6Z+4eK33i13VcKpd4HnDvf39U3eKpnEap7YmLNn8+fefDFOWXPxL0vH3tlVvf8Y4PtLe+0Hz+3aej0l54pJQUfFU/YNK6rcU95SelK0rN3W3t33/Gzx9qWk6MnzvQ9N7V535TN+6d/PL8k8XXHQ6Xf/rThreUzd9/342BZx2/ryr8J7th6eNn6uezZpamObcaM8o0Dvx55e+Yd+qm+kw1Ttw6kDvrXrtudCeM/3Y91Qh8PAAA=";    
    fetch(`https://api.sandbox.ebay.com/commerce/taxonomy/v1_beta/category_tree/0/get_item_aspects_for_category?category_id=${categoryId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept-Encoding': 'application/gzip'
      },
    })
      .then(response => response.json())
      .then(data => {
        data.aspects.map(aspect => {
          this.appendInput(aspect.localizedAspectName, "")
        })
      })
  }

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
                    <option disabled value="" key="none">(sélectionner)</option>
                    {this.state.ebayCategoryMap.rootCategoryNode ?
                      this.state.ebayCategoryMap.rootCategoryNode.childCategoryTreeNodes.map((categoryObject, index) => {
                        return (<option value={categoryObject.category.categoryId} key={index}>{categoryObject.category.categoryName}</option>)
                      })
                      :
                      undefined}
                  </Input>
                  {
                    Object.keys(this.state.selectedCategories).map(categoryLevel => (
                      this.state.selectedCategories[categoryLevel].childCategoryTreeNodes ?
                        <Input key={categoryLevel} type="select" name="select" id="exampleSelect" onChange={(e) => this.handleCategorySelect(e, categoryLevel)}>
                          <option disabled value="" key="none">(sélectionner)</option>
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
                  {this.state.availableCertifications && this.state.availableCertifications.length > 0 ?
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
              {/* TODO: Do not save empty custom data fields */}
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
