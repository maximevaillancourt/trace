import React, { Component } from 'react'
import PassageMainContractJson from '../build/contracts/PassageMain.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      products: [],
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

        // watch for new products
        const _this = this; // TODO: fix this ugly scope mess
        const event = this.state.Passage.ProductCreated({fromBlock: 0, toBlock: 'latest'})
        event.watch(function(error, result){
          console.log("haha")
          console.log(result)
          if (!error){
            const newProduct = {
              id: result.args.newProductId,
              name: result.args.name,
              description: result.args.description,
              location: result.args.location,
            }
            return _this.setState({ products: [..._this.state.products, newProduct]})
          } else {
            console.log(error);
          }
        });
      })
    })
  }

  handleCreateNewProduct = () => {
    // Create a dummy product
    this.state.Passage.createProduct("allo", "myDescription", "Montreal", {from: this.state.accounts[0], gas:3000000})
      .then((result) => {
        // success! display a success message maybe?
      })
  }

  render() {
    const productsItems = this.state.products.map((product) =>
      <li key={product.id}>{JSON.stringify(product)}</li> // stringifying the product's attributes for demo purposes
    );

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Passage</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <p><strong>Nouveau produit</strong></p>
              <button onClick={this.handleCreateNewProduct}>Créer un nouveau produit bidon</button>
              <p>Derniers produits stockés sur votre blockchain local: </p>
              <ul>
                {productsItems && productsItems.length > 0 ? productsItems : "Aucun produit." }
              </ul>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
