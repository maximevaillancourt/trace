import React, { Component } from 'react'
import {connect} from 'react-redux';
import * as mainActions from '../actions/mainActions';

import AnnotatedSection from '../components/AnnotatedSection'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCertificate from '@fortawesome/fontawesome-free-solid/faCertificate'

import {
  Container,
  Button,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

class CreateCertification extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      imageUrl: '',
    }
  }

  handleCreateNewCertification = () => {
    this.props.passageInstance.createCertification(this.state.name, this.state.imageUrl, {from: this.props.web3Accounts[0], gas:1000000})
      .then((result) => {
        this.props.history.push('/create'); // redirect to the home page
      })
  }

  render() {
    return (
      <div>
        <AnnotatedSection
          annotationContent = {
            <div>
              <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faCertificate}/>
              Nouvelle certification
            </div>
          }
          panelContent = {
            <div>
              <FormGroup>
                  <Label>Nom</Label>
                  <Input placeholder="Nom de la certification" value={this.state.name} onChange={(e) => {this.setState({name: e.target.value})}}></Input>
              </FormGroup>
              <FormGroup>
                  <Label>URL de l'image de la certification</Label>
                  <Input placeholder="https://" value={this.state.imageUrl} onChange={(e) => {this.setState({imageUrl: e.target.value})}}></Input>
              </FormGroup>
              <Button color="primary" onClick={this.handleCreateNewCertification}>Créer une nouvelle certification</Button>
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
    web3Accounts: state.temporaryGodReducer.web3Accounts,
  };
}

export default connect(mapStateToProps)(CreateCertification);
