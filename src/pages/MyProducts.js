import React, { Component } from 'react'
import {connect} from 'react-redux';
import QRCode from 'qrcode.react'
import { Link } from 'react-router-dom'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch'
import faList from '@fortawesome/fontawesome-free-solid/faList'
import faGroup from '@fortawesome/fontawesome-free-solid/faObjectGroup'

import AnnotatedSection from '../components/AnnotatedSection'
import Search from '../components/Search';

import {
  Container
} from 'reactstrap';

class View extends Component {

  constructor(props) {
    super(props);

    this.state = {
      products: []
    };
  }

  componentDidMount() {
    this.props.passageInstance.getOwnerProducts.call({gas:1000000})
      .then((result) => {

        result.map((productId) => {
          this.props.passageInstance.getProductById(String(productId).valueOf(), "latest")
            .then((result) => {
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
        <Link key={index} to={`/products/${product.id}`}>
          <div key={index}>
            <b>{product.name || "Produit sans nom"}</b> &mdash; {product.description || "Aucune description"}
            <hr/>
          </div>
        </Link>
      )
    })

    return (
      <div>
        <AnnotatedSection
          annotationContent = {
            <div>
              <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faSearch}/>
              Consulter un produit
            </div>
          }
          panelContent = {
            <div>
              <Search/>
            </div>
          }
        />
        <AnnotatedSection
          annotationContent = {
            <div>
              <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faList}/>
              Mes produits
              <Link style={{marginLeft: "10px"}} to="/create">Ajouter +</Link>
            </div>
          }
          panelContent = {
            <div>
              {products && products.length > 0 ? products : 
              <div>
                Vous n'avez créé aucun produit.
                <Link style={{marginLeft: "10px"}} to="/create">Ajouter un produit</Link>
              </div>}
            </div>
          }
        />
        <AnnotatedSection
          annotationContent = {
            <div>
              <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faGroup}/>
              Combiner des produits
            </div>
          }
          panelContent = {
            <div>
              <div>
                <Link style={{marginLeft: "10px"}} to="/combineList">Mode liste de produits</Link>
              </div>
              <div>
                <Link style={{marginLeft: "10px"}} to="/combineScan">Mode scan QR</Link>
              </div>
            </div>
          }
        />
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
