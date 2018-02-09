import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PassageMainContractJson from '../build/contracts/PassageMain.json'
import getWeb3 from './utils/getWeb3'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      products: [],
      name: "",
      description: "",
      location: "",
      Passage: null,
      accounts: null,
      web3: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    const contract = require('truffle-contract')
    const PassageContract = contract(PassageMainContractJson)
    PassageContract.setProvider(this.state.web3.currentProvider)

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      PassageContract.deployed().then((instance) => {
        this.setState({
          Passage: instance,
          accounts: accounts
        })
      })
    })
  }

  render() {
    return (
      <div>
        <p><b><Link to="/">Passage</Link></b></p>

        <p><Link to="/create">Create a product</Link></p>
        <p><Link to="/view">View a product</Link></p>

        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default App
