import React, { Component } from 'react'
import {connect} from 'react-redux';

import AnnotatedSection from '../components/AnnotatedSection'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCertificate from '@fortawesome/fontawesome-free-solid/faCertificate'

import {
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
      certificationOwner: '',
    }
  }

  handleCreateNewCertification = () => {
    this.props.passageInstance.createCertification(this.state.name, this.state.imageUrl, this.state.certificationOwner, {from: this.props.web3Accounts[0], gas:1000000})
      .then((result) => {
        this.props.history.push('/create'); // redirect to the home page
      })
  }

  render() {
    return (
      <div>
        <AnnotatedSection
          annotationContent={
            <div>
              <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faCertificate}/>
              New certification
            </div>
          }
          panelContent={
            <div>
              <FormGroup>
                  <Label>Certification name</Label>
                  <Input placeholder="Certification name" value={this.state.name} onChange={(e) => {this.setState({name: e.target.value})}}></Input>
              </FormGroup>
              <FormGroup>
                  <Label>Certification agency's address</Label>
                  <Input placeholder="0x..." value={this.state.certificationOwner} onChange={(e) => {this.setState({certificationOwner: e.target.value})}}></Input>
              </FormGroup>
              <FormGroup>
                  <Label>Certification image URL</Label>
                  <Input placeholder="https://" value={this.state.imageUrl} onChange={(e) => {this.setState({imageUrl: e.target.value})}}></Input>
              </FormGroup>
              <Button color="primary" onClick={this.handleCreateNewCertification}>Create certification</Button>
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
    web3Accounts: state.reducer.web3Accounts,
  };
}

export default connect(mapStateToProps)(CreateCertification);
