import React, { Component } from 'react'

import {
  Row,
  Col,
} from 'reactstrap';

class AnnotatedSection extends Component {

  render() {

    const annotationStyle = {
      marginTop:"25px"
    }

    const panelStyle = {
      backgroundColor: "white",
      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
      padding: "30px",
      borderRadius: "3px"
    }

    const layoutStyle = {
      marginBottom: "30px"
    }

    return (
      <div>
        <Row style={layoutStyle}>
          <Col sm="12" md="3" style={annotationStyle}>
            {this.props.annotationContent}
          </Col>
          <Col sm="12" md="9">
            <div style={panelStyle}>
              {this.props.panelContent}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AnnotatedSection;
