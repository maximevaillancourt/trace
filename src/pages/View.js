import React, { Component } from 'react'
import {connect} from 'react-redux';
import * as mainActions from '../actions/mainActions';
import QRCode from 'qrcode.react'
import { Link } from 'react-router-dom'

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
      location: "",
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
          location: result[2],
          versions: result[3],
          id: _this.props.productIdToView,
        })
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          name: "",
          description: "",
          location: "",
          versions: [],
          id: "",
        })
      })
  }

  render() {
    
    const versionsList = this.state.versions.map((version, index) => {
      return <li>Version {index + 1} ({version})</li>
    })

    return (
      <Container>
        <h1>{this.state.name}</h1>
        <p>{this.state.description}</p>
        <p><b>Emplacement:</b> {this.state.location}</p>
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
