import React, { Component } from 'react'
import { Form,Row,Button,Col } from 'react-bootstrap'
export default class Login extends Component {
  render() {
    return (
      <Form>
      <h3>Sign In</h3>

      <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
        <Form.Label column sm="2">
          Email address
        </Form.Label>
        <Col sm="10">
          <Form.Control type="email" placeholder="Enter Email" />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
        <Form.Label column sm="2">
          Password
        </Form.Label>
        <Col sm="10">
          <Form.Control type="password" placeholder="Enter Password" />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="formCheckboxRememberMe">
        <Col sm={{ span: 10, offset: 2 }}>
          <Form.Check
            inline
            label="Remember Me"
            name="group1"
            type="checkbox"
            id="inline-checkbox-1"
          />
        </Col>
      </Form.Group>

      <div className="d-grid">
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </div>

      <p className="forgot-password text-right">
        Forgot <a href="#">password?</a>
      </p>
    </Form>
    )
  }
}