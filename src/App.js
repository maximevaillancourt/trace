import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import {connect} from 'react-redux';

import PassageMainContractJson from '../build/contracts/PassageMain.json'
import getWeb3 from './utils/getWeb3'

import blockies from 'ethereum-blockies-png'

import * as mainActions from './actions/mainActions'

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container,
  Button
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
      .then(results => {
        this.props.dispatch(mainActions.setWeb3Instance(results.web3))
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

        const event = instance.ProductCreated({owner: this.props.web3Accounts[0]}) // TODO: extract event watchers into a new method/class?
        event.watch((error, result) => {
          if (!error){
            this.props.history.push('/products/' + result.args.newProductId); // upon product creation, redirect to the product page
          } else {
            console.log(error);
          }
        });
       
      })
    })
  }

  render() {
    const bodyColor = "hsl(136.7, 25%, 98.1%)";

    const activeLinkStyle = {
      fontWeight: 'bold',
      color: 'red'
     }

    const appJSX = (
      <div style={{minHeight:"100vh", borderTop:"3px solid #50b796", backgroundColor: "black", fontFamily: "Barlow"}}>
        <Navbar color="faded" light style={{paddingTop: "1em", paddingBottom:"2em", backgroundColor: bodyColor}} expand="md">
          <Container>
            <Link to='/'><img style={{width:"130px", marginRight: "20px"}} src="/logo-black.svg"/></Link>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              {/*
              <Nav className="mr-auto" navbar>
                <NavItem><NavLink tag={Link} to="/create">Produits</NavLink></NavItem>
                <NavItem><NavLink tag={Link} to="/createcertification">Certifications</NavLink></NavItem>
              </Nav>
              */}
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <NavLink tag={Link} to="#">
                    Mon compte
                    <img style={{marginLeft: "10px", width:"20px", height:"20px", borderRadius:"3px"}} src={blockies.createDataURL({ scale: 5, seed: this.props.web3 && this.props.passageInstance && this.props.web3Accounts ? this.props.web3Accounts[0] : ""})}/>
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
    web3: state.temporaryGodReducer.web3,
    web3Accounts: state.temporaryGodReducer.web3Accounts,
    passageInstance: state.temporaryGodReducer.passageInstance
  };
}

export default withRouter(connect(mapStateToProps)(App));

