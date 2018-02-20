import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PassageMainContractJson from '../build/contracts/PassageMain.json'
import getWeb3 from './utils/getWeb3'

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
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
  Row,
  Col,
  Jumbotron,
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
            const newProduct = {
              id: result.args.newProductId,
              owner: result.args.owner,
            }

            // Do we want to keep a list of all added products in the app's state?
            // return this.props.dispatch(mainActions.addProduct(newProduct))
            
            return this.props.dispatch(mainActions.createAlert({
              color: "success",
              content: "Product created: " + newProduct.id,
              rawData: newProduct.id,
            }))

          } else {
            console.log(error);
          }
        });
       
      })
    })
  }

  render() {
    const appJSX = (
      <div>
        <Navbar color="faded" light expand="md">
          <Container>
            <NavbarBrand tag={Link} to='/'>Passage</NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem><NavLink tag={Link} to="/create">Ajouter un produit</NavLink></NavItem>
                <NavItem><NavLink tag={Link} to="/view">Voir un produit</NavLink></NavItem>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
        {this.props.children}
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

export default connect(mapStateToProps)(App);

