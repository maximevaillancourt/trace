import React, { Component } from 'react'
import {connect} from 'react-redux';
import * as mainActions from '../actions/mainActions';
import QRCode from 'qrcode.react'
import { Link } from 'react-router-dom'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

import {
  Container,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
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
      versions: [],
      id: "",
    };
  }

  componentDidMount() {
    this.props.passageInstance.getProductById(new String(this.props.productIdToView).valueOf())
      .then((result) => {
        console.log(result)
        var _this = this;
        this.setState({
          name: result[0],
          description: result[1],
          latitude: parseFloat(result[2]),
          longitude: parseFloat(result[3]),
          versions: result[4],
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
      <Container>
        <h1>{this.state.name}</h1>
        <p>{this.state.description}</p>
        <h2>Dernier emplacement connu</h2>

        <MyMapComponent
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyDvLv2v8JgbUGp4tEM7wRmDB0fXbO_Em4I&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />

        <p><b>Versions:</b></p>
        <ul>
          {versionsList}
        </ul>

        <div>
          <Link to={"/products/" + this.state.id + "/update"}>Ajouter une version</Link>
        </div>
        <hr/>
        {this.state.name ? <QRCode value={this.state.id}/> : null }
        
      </Container>
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
