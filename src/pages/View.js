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
      name: "",
      description: "",
      latitude: "",
      longitude: "",
      versionCreationDate: "",
      versions: [],
      id: "",
    };
  }

  componentDidMount() {
    this.props.passageInstance.getProductById(String(this.props.match.params.productId).valueOf())
      .then((result) => {
        console.log(result)
        var _this = this;
        this.setState({
          name: result[0],
          description: result[1],
          latitude: parseFloat(result[2]),
          longitude: parseFloat(result[3]),
          versionCreationDate: Date(result[4]),
          versions: result[5],
          id: _this.props.productIdToView,
        })
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          name: "",
          description: "",
          latitude: "",
          longitude: "",
          versionCreationDate: "",
          versions: [],
          id: "",
        })
      })
  }

  render() {
    
    const versionsList = this.state.versions.map((version, index) => {
      return <li key={index}>Version {index + 1} ({version})</li>
    })

    const myLat = this.state.latitude;
    const myLng = this.state.longitude;

    const MyMapComponent = withScriptjs(withGoogleMap((props) =>
      <GoogleMap
        defaultZoom={8}
        defaultCenter={{ lat: myLat, lng: myLng }}
      >
        {<Marker position={{ lat: myLat, lng: myLng }} />}
      </GoogleMap>
    ))

    return (
      <div>

        <div style={{display:"flex"}}>
          <div style={{flex: 1}}>
            <h1>{this.state.name}</h1>
            <p>{this.state.description}</p>
            <p>Dernière version : {this.state.versionCreationDate}</p>
          </div>
          <div style={{flex:1, textAlign:"right"}}>
            <QRCode value={this.props.match.params.productId}/>
          </div>

        </div>

        <hr/>
        
        <h2>Dernier emplacement connu</h2>
        <div>
          {myLat && myLng ? 
            <MyMapComponent
              googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyDvLv2v8JgbUGp4tEM7wRmDB0fXbO_Em4I&libraries=geometry,drawing,places"
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `400px` }} />}
              mapElement={<div style={{ height: `100%` }} />}
            />
            :
            null
          }
        </div>

        <hr/>

        <h2>Historique</h2>
        <Link to={"/products/" + this.props.match.params.productId + "/update"}>
          <Button color="success">
            Ajouter une version
          </Button>
        </Link>
        <ul>
          {versionsList}
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
