import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import {connect} from 'react-redux';

import PassageMainContractJson from '../build/contracts/PassageMain.json'
import getWeb3 from './utils/getWeb3'

import * as mainActions from './actions/mainActions';

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
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
    const appJSX = (
      <div style={{fontFamily: "Roboto"}}>
        <Navbar color="faded" light style={{marginBottom: "1.5em"}} expand="md">
          <Container>
            <NavbarBrand tag={Link} to='/'>Passage</NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem><NavLink tag={Link} to="/my-products">Mes produits</NavLink></NavItem>
                <NavItem><NavLink tag={Link} to="/create">Nouveau produit</NavLink></NavItem>
                <NavItem><NavLink tag={Link} to="/createcertification">Nouvelle certification</NavLink></NavItem>
                <NavItem><NavLink tag={Link} to="/search">Recherche</NavLink></NavItem>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
        <Container>
          {this.props.children}
        </Container>
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

