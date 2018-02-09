import React, { Component } from 'react'
import PassageMainContractJson from '../../build/contracts/PassageMain.json'
import getWeb3 from '../utils/getWeb3'

class Create extends Component {
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

        // watch for new products
        const _this = this; // TODO: fix this ugly scope mess
        const event = this.state.Passage.ProductCreated({fromBlock: 0, toBlock: 'latest'})
        event.watch(function(error, result){
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
    this.state.Passage.createProduct(this.state.name, this.state.description, this.state.location, {from: this.state.accounts[0], gas:3000000})
      .then((result) => {
        // success! display a success message maybe?
      })
  }

  render() {
    const productsItems = this.state.products.map((product) =>
      <li key={product.id}>{JSON.stringify(product)}</li> // stringifying the product's attributes for demo purposes
    );

    return (
      <div>
        <p><strong>Nouveau produit</strong></p>
        <div>
            <label>Nom</label>
            <input value={this.state.name} onChange={(e) => {this.setState({name: e.target.value})}}></input>
        </div>
        <div>
            <label>Description</label>
            <input value={this.state.description} onChange={(e) => {this.setState({description: e.target.value})}}></input>
        </div>
        <div>
            <label>Emplacement actuel</label>
            <input value={this.state.location} onChange={(e) => {this.setState({location: e.target.value})}}></input>
        </div>
        <button onClick={this.handleCreateNewProduct}>Créer un nouveau produit</button>
        <p>Derniers produits stockés sur votre blockchain local: </p>
        <ul>
            {productsItems && productsItems.length > 0 ? productsItems : "Aucun produit." }
        </ul>
      </div>
    );
  }
}

export default Create
