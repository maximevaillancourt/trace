import React, { Component } from 'react'
import {connect} from 'react-redux';
import QRCode from 'qrcode.react'
import { Link } from 'react-router-dom'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

import {
  Container,
  Button
} from 'reactstrap';

class View extends Component {

  constructor(props) {
    super(props);

    // TODO: move this to Redux store
    this.state = {
      products: []
    };
  }

  componentDidMount() {
    this.props.passageInstance.getOwnerProducts()
      .then((result) => {
        console.log(result)

        result.map((productId) => {
          this.props.passageInstance.getProductById(String(productId).valueOf(), "latest")
            .then((result) => {
              console.log(result)
              var _this = this;
              const product = {
                name: result[0],
                description: result[1],
                latitude: parseFloat(result[2]),
                longitude: parseFloat(result[3]),
                versionCreationDate: Date(result[4]),
                versions: result[5],
                id: productId,
              }
              this.setState({products: [...this.state.products, product]})
            })
            .catch((error) => {
              console.log(error);
            })
        })
      });
  }

  render() {
    
    const products = this.state.products.map((product, index) => {
      return (
        <li key={index}>
          <Link to={`/products/${product.id}`}>{product.name} ({product.description})</Link>
        </li>
      )
    })

    return (
      <div>
        <h2>Mes produits</h2>
        <ul>
          {products && products.length > 0 ? products : "Loading..."}
        </ul>

        <hr/>

        
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    passageInstance: state.temporaryGodReducer.passageInstance,
    productIdToView: state.temporaryGodReducer.productIdToView
  };
}

export default connect(mapStateToProps)(View);
