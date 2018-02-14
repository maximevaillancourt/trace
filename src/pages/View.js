import React, { Component } from 'react'
import {connect} from 'react-redux';
import * as mainActions from '../actions/mainActions';
import QRCode from 'qrcode.react'

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
      id: "",
    };
  }

  handleClick = () => {
    this.props.passageInstance.getProductById(this.props.productIdToView)
      .then((result) => {
        console.log(result)
        var _this = this;
        this.setState({
          name: result[0],
          description: result[1],
          location: result[2],
          id: _this.props.productIdToView,
        })
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          name: "",
          description: "",
          location: "",
          id: "",
        })
      })
  }

  render() {
    return (
      <Container>
        <FormGroup>
          <Label>ID du produit à consulter</Label>
         
          <InputGroup>
            <Input value={this.props.productIdToView} onChange={(e) => {this.props.dispatch(mainActions.updateProductIdToView(e.target.value))}}></Input>
            <InputGroupAddon addonType="append">
              <Button color="primary" onClick={this.handleClick.bind(this)}>Voir</Button>
            </InputGroupAddon>
          </InputGroup>
        </FormGroup>
        <p><b>Nom:</b> {this.state.name}</p>
        <p><b>Description:</b> {this.state.description}</p>
        <p><b>Emplacement:</b> {this.state.location}</p>
        {this.state.name ? <QRCode value={"passage_product_" + this.state.id}/> : null }
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
