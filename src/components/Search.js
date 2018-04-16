import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import {
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  Button
} from 'reactstrap';

class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
      productIdToView: ""
    };
  }

  render() {
    return (
      <div>
        <FormGroup>
          <Label>Product identifier</Label>
          <InputGroup>
            <Input placeholder="0x..." value={this.state.productIdToView} onChange={(e) => {this.setState({productIdToView: e.target.value})}}></Input>
            <InputGroupAddon addonType="append">
              <Link to={"/products/" + this.state.productIdToView}><Button style={{borderBottomLeftRadius:"0", borderTopLeftRadius:"0"}} color="primary">Search</Button></Link>
            </InputGroupAddon>
          </InputGroup>
        </FormGroup>        
      </div>
    );
  }
}

export default Search;
