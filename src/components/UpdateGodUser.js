import React, { Component } from 'react'
import {connect} from 'react-redux';

import AnnotatedSection from '../components/AnnotatedSection'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faUserPlus from '@fortawesome/fontawesome-free-solid/faUserPlus'

import {
    Button,
    FormGroup,
    InputGroup,
    InputGroupAddon,
    Label,
    Input
} from 'reactstrap';

class UpdateGodUser extends Component {

  constructor(props) {
    super(props)

    // initialize the component's state
    this.state = {
      newGodAddress: ''
    }
  }

  handleUpdateGodUser = () => {
    this.props.passageInstance.updateGodUser(this.state.newGodAddress, {from: this.props.web3Accounts[0], gas:1000000})
      .then((result) => {
        // product created! ... but we use an event watcher to show the success message, so nothing actuelly happens here after we create a product
      })
  }

  render() {
    return (
      <AnnotatedSection
        annotationContent={
          <div>
            <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faUserPlus}/>
            Transférer God mode
          </div>
        }
        panelContent={
          <div>
            <FormGroup>
              <Label>Adresse du nouveau God</Label>
              <InputGroup>
                <Input placeholder="0x..." value={this.state.newGodAddress} onChange={(e) => {this.setState({newGodAddress: e.target.value})}}></Input>
                <InputGroupAddon addonType="append">
                  <Button style={{borderBottomLeftRadius:"0", borderTopLeftRadius:"0"}} color="primary"  onClick={this.handleUpdateGodUser}>Transférer</Button>
                </InputGroupAddon>
              </InputGroup>
            </FormGroup>
          </div>
        }
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    web3: state.reducer.web3,
    passageInstance: state.reducer.passageInstance,
    web3Accounts: state.reducer.web3Accounts,
    userAddress: state.reducer.userAddress
  };
}

export default connect(mapStateToProps)(UpdateGodUser);

