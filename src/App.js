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

        const _this = this; // TODO: fix this js scope mess (let? arrow function?)
        const event = instance.ProductCreated({fromBlock: 0, toBlock: 'latest'}) // TODO: extract event watchers into a new method/class?
        event.watch(function(error, result){
          if (!error){
            const newProduct = {
              id: result.args.newProductId,
              name: result.args.name,
              description: result.args.description,
              location: result.args.location,
            }
            return _this.props.dispatch(mainActions.addProduct(newProduct))
          } else {
            console.log(error);
          }
        });
      })
    })
  }

  render() {
    return (
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
    );
  }
}

function mapStateToProps(state) {
  return {
    web3: state.temporaryGodReducer.web3
  };
}

export default connect(mapStateToProps)(App);

