import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import {connect} from 'react-redux';
import Notifications, {notify} from 'react-notify-toast'

import PassageMainContractJson from '../build/contracts/PassageMain.json'
import getWeb3 from './utils/getWeb3'

import blockies from 'ethereum-blockies-png'

import * as mainActions from './actions/mainActions'

import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  Container,
} from 'reactstrap';

class App extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  componentWillMount() {
    getWeb3
      .then(data => {
        this.props.dispatch(mainActions.setWeb3Instance(data.web3))
        this.instantiateContract()
      })
      .catch((err) => {
        console.error(err)
        console.log('Error finding web3.')
      })
  }

  instantiateContract() {
    const contract = require('truffle-contract')
    const PassageContract = contract(PassageMainContractJson)
    PassageContract.setProvider(this.props.web3.currentProvider)

    this.props.web3.eth.getAccounts((error, accounts) => {
      PassageContract.deployed().then((instance) => {
        this.props.dispatch(mainActions.setPassageInstance(instance))
        this.props.dispatch(mainActions.setWeb3Accounts(accounts))

        // remember the current web3 account
        var currentAccount = accounts[0];

        // every 1000ms, check if the web3 account changed
        setInterval(() => {
          this.props.web3.eth.getAccounts((error, accounts) => {
            // reload the entire app if the account changed
            if (accounts[0] !== currentAccount) {
              window.location = "/"
            }
          })
        }, 1000)

        // upon product creation, redirect to the home page and show a notification
        const event = instance.ProductCreated({owner: this.props.web3Accounts[0]}) // TODO: extract event watchers into a new method/class?
        event.watch((error, result) => {
          if (!error){
            this.props.history.push('/');
            notify.show("Product created.", "custom", 5000, { background: '#50b796', text: "#FFFFFF" });
          } else {
            console.log(error);
          }
        });
       
      })
    })
  }

  render() {
    const bodyColor = "hsl(136.7, 25%, 98.1%)";

    const appJSX = (
      <div style={{minHeight:"100vh", borderTop:"4px solid #50b796", backgroundColor: "black", fontFamily: "Barlow"}}>
        <Notifications/>
        <Navbar color="faded" light style={{paddingTop: "1em", paddingBottom:"2em", backgroundColor: bodyColor}} expand="md">
          <Container>
            <Link to='/'><img alt="Logo Trace" style={{width:"130px", marginRight: "20px"}} src="/logo-black.svg"/></Link>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <NavLink tag={Link} to="/account">
                    My account
                    <img alt="Profile avatar" style={{marginLeft: "10px", width:"20px", height:"20px", borderRadius:"3px"}} src={blockies.createDataURL({ scale: 5, seed: this.props.web3 && this.props.passageInstance && this.props.web3Accounts ? this.props.web3Accounts[0] : ""})}/>
                  </NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
        <div style={{backgroundColor: bodyColor, paddingBottom: "3em"}}>
          <Container>
            {this.props.children}
          </Container>
        </div>
        <div style={{padding: "2em 0", color:"white", backgroundColor: "#000000"}}>
          <Container>
            © 2018 Trace
          </Container>
        </div>
      </div>
    )

    const waitingForWeb3JSX = (
      <div style={{
        textAlign: "center",
        padding: "1em"
      }}>
        Waiting for web3...
      </div>      
    )
    return (
      <div>
        {this.props.web3 && this.props.passageInstance && this.props.web3Accounts ? appJSX : waitingForWeb3JSX}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    web3: state.reducer.web3,
    web3Accounts: state.reducer.web3Accounts,
    passageInstance: state.reducer.passageInstance
  };
}

export default withRouter(connect(mapStateToProps)(App));

