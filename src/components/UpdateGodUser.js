import React, { Component } from 'react'
import {connect} from 'react-redux';
import {notify} from 'react-notify-toast'

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
        notify.show("Administrator updated.", "custom", 5000, { background: '#50b796', text: "#FFFFFF" });
      })
  }

  render() {
    return (
      <AnnotatedSection
        annotationContent={
          <div>
            <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faUserPlus}/>
            Transfer administration rights
          </div>
        }
        panelContent={
          <div>
            <FormGroup>
              <Label>New administrator's Ethereum address</Label>
              <InputGroup>
                <Input placeholder="0x..." value={this.state.newGodAddress} onChange={(e) => {this.setState({newGodAddress: e.target.value})}}></Input>
                <InputGroupAddon addonType="append">
                  <Button style={{borderBottomLeftRadius:"0", borderTopLeftRadius:"0"}} color="primary"  onClick={this.handleUpdateGodUser}>Update</Button>
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

