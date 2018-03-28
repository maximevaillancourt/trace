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

  setCustomAspects = (categoryId) => {

    // TODO: implement a thin back-end server (using Express.js?) to handle the OAuth token request flow.
    // This is a temporary way to make the request work. Later on, we'll replace that with a call to our thin back-end server
    // instead of hardcoding a token value like the one below (which expires every 2 hours)
    const token = "v^1.1#i^1#I^3#f^0#r^0#p^1#t^H4sIAAAAAAAAAOVXfWwURRTv9csUKFYBUSTm2GpC1P3eO3c3vUuOtpRKPw7uLAIaMrc7266921135myPBNI0FbCxGBrF4FcIEbXGyIdiTPxLTYxBhQgiRogaIopKjNEQRBNwdnst10qgQkUS75/LvHnz5v1+7zdvdrie8oo71y1ad7oycF3x1h6upzgQ4KdyFeVld00vKZ5TVsQVOAS29tzeU9pbcqIGgUzaUZdC5NgWgsHuTNpCqm+MUFnXUm2ATKRaIAORijU1EWtuUgWGUx3XxrZmp6lgY12EksJhPWxASYKSIgiKRqzWSMykHaFEkJIUSVBCsgAhCPFkHqEsbLQQBhaOUALHyzQn0oKc5EVV4FSJZ4SQsoIKtkEXmbZFXBiOivrpqv5atyDXi6cKEIIuJkGoaGNsYaI11lhX35KsYQtiRfM8JDDAWTR2VGvrMNgG0ll48W2Q760mspoGEaLY6PAOY4OqsZFkLiN9n2ogciAMZD2kQQA1XZ8UKhfabgbgi+fhWUydNnxXFVrYxLlLMUrYSD0ENZwftZAQjXVB729JFqRNw4RuhKpfEFsei8epaDPoNjOwDdBJF2iQji+to6WQqIV1KIdpQ+FCkJOF/C7DofIcj9um1rZ002MMBVtsvACSlOF4YvgCYohTq9XqxgzspVPoFxohUCJ+7EgJs7jD8ooKM4SFoD+8NP2jqzF2zVQWw9EI4yd8fkihHcfUqfGTvhDz2ulGEaoDY0dl2a6uLqZLZGy3nRU4jmfvb25KaB0wA6hhX++sE3/z0gto04eiQbISmSrOOSSXbiJUkoDVTkWFe8KSIOZ5H5tWdLz1b4YCzOzY4zBZx0PhOUOT+FRICwMlJUxKp4nmFcp6ecAUyNEZ4HZC7KQ9mWpEZ9kMdE1dFUOGIMoGpPWwYtCSYhh0KqSHad6AkIMwldIU+X9zSiaq84RmOzBup00tN1lqnxyli64eBy7OJWA6TQwTlfwFQSIP5FWC5531CUL0YiASBDgm4wmb0ewMawPS0TzTKj/rK8JtkpvwmioqATiM1NSHrzDGh8ugRzTGhcjOuuT2Zlq9pp60O6FFTgl27XQaum38FTExqe38v2jlF0SlpU1C46prDdk/6ZGXKWyArwXIpb2Bpedh8yFBECRRkK5MqrV+UZO5q9axJljVRTbCUP8XPj3Ysa+gaJH/43sDe7jewC7ykOJY7g6+mptXXnJfacm0OcjEkDGBwSCz3SIf9y5kOmHOAaZbXB5YOXfn0KqCd9fWB7mbR19eFSX81IJnGDf3/EwZf/3sSl7mREHmRYGT+BVc9fnZUv6m0pkVe/dv21wky7PiK6oSLQ17k28mZ3OVo06BQFkREUTRC2fOntx0pvGpW+uPbT/6y4vuykPLPni189dDfW3KA20Db806cHpq4smhT6s/Ovzb+g27NoOqg83xKUeDhxoONGsb8fKVwY3qroNK6evmOzMb9i3ePf/IicoZT6uZ9nv3l/UtjFP9DTtenle27IYDzuN/zjuzvn7awNvnkrE1h5fkti+f2f3Ee1sqdnfv2Pf+8dbBUz8NbmlYXTx9Tt3xz6qGvpv7aH+t/vnDGz5+fpBdcw5pa5MV23DVz4vr1oo7P/yqr/+LmqFNd7/75W3FX98orz/9Q4f4ktHkHjEjQ/CV8vYZ1u7VTamzf9Q4nzy27dieZwNLXjslPHPLt7nBvh+l56bMH0h9P9D/xje/n1ydGi7fX8Fd274RDwAA";
    
    const url = `https://api.ebay.com/commerce/taxonomy/v1_beta/category_tree/2/get_item_aspects_for_category?category_id=${categoryId}`
    fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept-Encoding': 'application/gzip'
      },
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ customDataInputs: {} })
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
                    <option selected disabled value="" key="none">(sélectionner)</option>
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
