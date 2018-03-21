import React, { Component } from 'react'
import {connect} from 'react-redux';
import QRCode from 'qrcode.react'
import { Link } from 'react-router-dom'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polyline } from "react-google-maps"

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faInfoCircle from '@fortawesome/fontawesome-free-solid/faInfoCircle'
import faThumbtack from '@fortawesome/fontawesome-free-solid/faThumbtack'
import faWrench from '@fortawesome/fontawesome-free-solid/faWrench'
import faMapMarker from '@fortawesome/fontawesome-free-solid/faMapMarker'
import faCertificate from '@fortawesome/fontawesome-free-solid/faCertificate'
import faHistory from '@fortawesome/fontawesome-free-solid/faHistory'
import faUngroup from '@fortawesome/fontawesome-free-solid/faObjectUngroup'

import AnnotatedSection from '../components/AnnotatedSection'

import {
  Container,
  Button,
  Table
} from 'reactstrap';

class View extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: "",
      description: "",
      latitude: "",
      longitude: "",
      versionCreationDate: "",
      versions: [],
      certifications: [],
      id: "",
      customDataJson: ""
    };
  }

  componentWillReceiveProps(nextProps){
    this.fetchProduct(nextProps);
  }

  componentDidMount(){
    this.fetchProduct(this.props);
  }

  fetchProduct(props){
    this.props.passageInstance.getProductById(String(props.match.params.productId).valueOf(), props.match.params.versionId ? String(props.match.params.versionId).valueOf() : "latest")
      .then((result) => {

        this.setState({
          name: result[0],
          description: result[1],
          latitude: parseFloat(result[2]),
          longitude: parseFloat(result[3]),
          versionCreationDate: new Date(result[4].c * 1000).toString(),
          versions: [],
          id: props.match.params.productId,
          certifications: []
        })

        const certificationsArray = result[6];
        certificationsArray.map((certificationId) => {
          this.props.passageInstance.getCertificationById(String(certificationId).valueOf())
            .then((certificationResult) => {
              const certification = {
                name: certificationResult[0],
                imageUrl: certificationResult[1],
                id: certificationId,
              }
              this.setState({certifications: [...this.state.certifications, certification]})
            });
        });

        const versionsArray = result[5];
        versionsArray.map((versionId) => {
          this.props.passageInstance.getVersionLatLngById(String(versionId).valueOf())
            .then((latLngResult) => {
              console.log(latLngResult)
              const version = {
                latitude: parseFloat(latLngResult[0]),
                longitude: parseFloat(latLngResult[1]),
                id: versionId,
              }
              this.setState({versions: [...this.state.versions, version]})
            });
        });
      })
      .catch((error) => {
        this.setState({
          name: "",
          description: "",
          latitude: "",
          longitude: "",
          versionCreationDate: "",
          versions: [],
          certifications: [],
          id: "",
        })
      })


    this.props.passageInstance.getProductCustomDataById(String(props.match.params.productId).valueOf(), props.match.params.versionId ? String(props.match.params.versionId).valueOf() : "latest")
      .then((result) => {
        this.setState({
          customDataJson: result
        })
      })
      .catch((error) => {
        this.setState({
          customDataJson: ""
        })
      })
  }

  render() {
    
    const versionsList = this.state.versions.map((version, index) => {
      return (
        <li key={index}>
          <Link to={`/products/${this.props.match.params.productId}/versions/${version.id}`}>Version {index + 1}</Link>
        </li>
      )
    }).reverse()

    const certificationsList = this.state.certifications.map((certification, index) => {
      return (
        <div style={{display:"inline-block", marginRight:"15px", width:"100px", height:"100px"}} key={index}>
          {certification.imageUrl ? <img style={{width:"100%"}} src={certification.imageUrl}/> : <div>{certification.name}</div>}
        </div>
      )
    })

    const currentLat = this.state.latitude;
    const currentLng = this.state.longitude;

    const markersJSX = this.state.versions.map((version, index) => {
      return (
        <Marker key={index} label={(index + 1).toString()} position={{ lat: version.latitude, lng: version.longitude }} />
      )
    })

    const versionsLatLngs = this.state.versions.map((version, index) => {
      return { lat: version.latitude, lng: version.longitude }
    });

    const polylineJSX = (
      <Polyline
        path={versionsLatLngs}
        geodesic
        options={{
          strokeColor: 'red',
          strokeOpacity: 0.5,
          strokeWeight: 4
        }}
      />
    )

    const MyMapComponent = withScriptjs(withGoogleMap((props) =>
      <GoogleMap
        defaultZoom={8}
        defaultCenter={{ lat: currentLat, lng: currentLng }}
      >
        <div>
          {markersJSX}
          {polylineJSX}
        </div>
      </GoogleMap>
    ))

    const customData = this.state.customDataJson ? JSON.parse(this.state.customDataJson) : {};

    return (
      <div>
        <AnnotatedSection
          annotationContent = {
            <div>
              <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faInfoCircle}/>
              Définition du produit
            </div>
          }
          panelContent = {
            <Table>
              <tbody>
                <tr>
                  <th scope="row">Nom</th>
                  <td>{this.state.name}</td>
                </tr>
                <tr>
                  <th scope="row">Description</th>
                  <td>{this.state.description}</td>
                </tr>
                <tr>
                  <th scope="row">Date de création de la version</th>
                  <td>{this.state.versionCreationDate}</td>
                </tr>
                {
                  Object.keys(customData).map(key =>
                    <tr key={key}>
                      <th scope="row">{key}</th>
                      <td>{customData[key]}</td>
                    </tr>
                  )
                }
              </tbody>
            </Table>
          }
        />

        <AnnotatedSection
          annotationContent = {
            <div>
              <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faThumbtack}/>
              Informations de suivi
            </div>
          }
          panelContent = {
            <div>
              <QRCode value={this.props.match.params.productId}/>
              <div>
                Identifiant unique du produit
                <pre>{this.state.id}</pre>
              </div>
            </div>
          }
        />

        <AnnotatedSection
          annotationContent = {
            <div>
              <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faWrench}/>
              Actions
            </div>
          }
          panelContent = {
            <div>
              { this.props.match.params.versionId && this.state.versions && this.state.versions.length > 0 && this.props.match.params.versionId.toString() != this.state.versions.slice(-1)[0].id.toString() ?
                  <Link to={"/products/" + this.props.match.params.productId}>
                    <Button color="info">
                      Voir la dernière version
                    </Button>
                  </Link>
                :
                  <Link to={"/products/" + this.props.match.params.productId + "/update"}>
                    <Button color="success">
                      Mettre à jour
                    </Button>
                  </Link>
              }
            </div>
          }
        />

        <AnnotatedSection
          annotationContent = {
            <div>
              <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faMapMarker}/>
              Emplacement géographique
            </div>
          }
          panelContent = {
            <div>
              {currentLat && currentLng ? 
                <div>
                  <pre>{currentLat}, {currentLng}</pre>
                  <MyMapComponent
                    googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyDvLv2v8JgbUGp4tEM7wRmDB0fXbO_Em4I&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `400px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                  />
                </div>
                :
                <p>Impossible d'afficher l'emplacement géographique.</p>
              }
            </div>
          }
        />

        <AnnotatedSection
          annotationContent = {
            <div>
              <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faCertificate}/>
              Certifications attribuées
            </div>
          }
          panelContent = {
            <div>
              {certificationsList && certificationsList.length > 0 ? certificationsList : "Aucune certification."}
            </div>
          }
        />

        <AnnotatedSection
          annotationContent = {
            <div>
              <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faHistory}/>
              Historique des versions
            </div>
          }
          panelContent = {
            <div>
              <ul>
                {versionsList}
              </ul>
            </div>
          }
        />

        <AnnotatedSection
          annotationContent = {
            <div>
              <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faUngroup}/>
              Séparer ce produit
            </div>
          }
          panelContent = {
            <div>
              <Link style={{marginLeft: "10px"}} to="/split">Séparer ce produit</Link>
            </div>
          }
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    passageInstance: state.temporaryGodReducer.passageInstance
  };
}

export default connect(mapStateToProps)(View);
