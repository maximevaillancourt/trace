import React, { Component } from 'react'
import {connect} from 'react-redux';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import { Link } from 'react-router-dom'

import AnnotatedSection from '../components/AnnotatedSection'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faWrench from '@fortawesome/fontawesome-free-solid/faWrench'
import faStar from '@fortawesome/fontawesome-free-solid/faStar'
import faList from '@fortawesome/fontawesome-free-solid/faList'

import {
  Button,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

class CombineList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      description: '',
      latitude: '',
      longitude: '',
      address: '',
      availableCertifications: [],
      buttonDisabled: false,
      selectedCertifications: {},
      customDataInputs: {},
      products: []
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
          return false;
        });
    })

    this.props.passageInstance.getOwnerProducts()
      .then((result) => {

        result.map((productId) => {
          this.props.passageInstance.getProductById(String(productId).valueOf(), "latest")
            .then((result) => {
              var _this = this;
              const product = {
                name: result[0],
                description: result[1],
                latitude: parseFloat(result[2]),
                longitude: parseFloat(result[3]),
                versionCreationDate: Date(result[4]),
                versions: result[5],
                id: productId,
              }
              this.setState({products: [...this.state.products, product]})
            })
            .catch((error) => {
              console.log(error);
            })
          return false;
        })
      });
  }

  handleChange = (e) => {
    const certificationId = e.target.name;
    this.setState({selectedCertifications: {...this.state.selectedCertifications, [certificationId]: e.target.checked}})
  }

  handleCreateNewProduct = () => {
    const selectedCertifications = this.state.selectedCertifications;
    const certificationsArray = [];
    Object.keys(selectedCertifications).map(key => {
      if(selectedCertifications[key] === true){
        certificationsArray.push(key)
      }
      return false;
    })

    var customDataObject = {}
    Object.keys(this.state.customDataInputs).map(inputKey => {
      customDataObject[this.state.customDataInputs[inputKey].key] = this.state.customDataInputs[inputKey].value;
      return false;
    })
    this.props.passageInstance.createProduct(this.state.name, this.state.description, this.state.latitude.toString(), this.state.longitude.toString(), certificationsArray, JSON.stringify(customDataObject), {from: this.props.web3Accounts[0], gas:1000000})
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
    var newInputKey = `input-${Object.keys(this.state.customDataInputs).length}`; // this might not be a good idea (e.g. when removing then adding more inputs)
    this.setState({ customDataInputs: {...this.state.customDataInputs, [newInputKey]: {key: "", value: ""} }});
  }

  render() {
    const products = this.state.products.map((product, index) => {
      return (
        <div key={index}>
          <FormGroup>
            <Input type="checkbox" name="productSelection" onChange={(e) => {}}></Input>
          </FormGroup>
          <Link to={`/products/${product.id}`}>
            <div>
              <b>{product.name || "Untitled product"}</b> &mdash; {product.description || "No description"}
              <hr/>
            </div>
          </Link>
        </div>
      )
    })

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
              <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faList}/>
              Product selection
            </div>
          }
          panelContent={
            <div>
              {products && products.length > 0 ? products : 
              <div>
                You did not add any product yet.
                <Link style={{marginLeft: "10px"}} to="/create">Add a product</Link>
              </div>}
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
              <FormGroup>
                <Label>
                  Certification(s)
                  <Link style={{marginLeft: "10px"}} to="/createcertification">Create +</Link>
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
                      No certification available.
                      <Link style={{marginLeft: "10px"}} to="/createcertification">Create a certification</Link>
                    </div>
                  }
                </div>
              </FormGroup>
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
              <Button disabled={this.state.buttonDisabled} color="primary" onClick={this.handleCreateNewProduct}>Combine products</Button>
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

export default connect(mapStateToProps)(CombineList);
