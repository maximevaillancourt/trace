import React, { Component } from 'react'
import {connect} from 'react-redux';
import * as mainActions from '../actions/mainActions';
import { Link } from 'react-router-dom'

import AnnotatedSection from '../components/AnnotatedSection'
import UpdateGodUser from '../components/UpdateGodUser';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faUser from '@fortawesome/fontawesome-free-solid/faUser'

import {
    Button,
    FormGroup,
    InputGroup,
    InputGroupAddon,
    Label,
    Input
} from 'reactstrap';

class Account extends Component {

    constructor(props) {
      super(props);

      this.state = {
        isGod: false
      };

      props.web3.eth.getBalance(props.web3Accounts[0], function (err, result) {
        document.getElementById("EtherBalance").innerHTML = props.web3.fromWei(result, 'ether');
      });
    }

    componentDidMount(){
      this.props.passageInstance.isUserGod({ from: this.props.web3Accounts[0] })
        .then((result) => {
          this.setState({isGod: result});
        });
    }
  
    render() {
      return (
        <div>
          <AnnotatedSection
            annotationContent={
              <div>Informations du compte</div>
            }
            panelContent={
              <div>
                <div>Adresse : {this.props.web3Accounts[0]}</div>
                <div>Ether : <span id="EtherBalance"></span></div>
              </div>
            }
          />
          {this.state.isGod &&
            <UpdateGodUser />
          }
        </div>
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
  
  export default connect(mapStateToProps)(Account);
  