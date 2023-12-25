import React, { Component } from 'react'
import { Form,Row,Button,Col } from 'react-bootstrap'
export default class SignUp extends Component {
  render() {
    return (
      <Form>
      <h3>Sign Up</h3>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={2}>
          First name
        </Form.Label>
        <Col sm={10}>
          <Form.Control type="text" placeholder="First name" />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={2}>
          Last name
        </Form.Label>
        <Col sm={10}>
          <Form.Control type="text" placeholder="Last name" />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={2}>
          Email address
        </Form.Label>
        <Col sm={10}>
          <Form.Control type="email" placeholder="Enter email" />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={2}>
          Password
        </Form.Label>
        <Col sm={10}>
          <Form.Control type="password" placeholder="Enter password" />
        </Col>
      </Form.Group>

      <div className="d-grid">
        <Button variant="primary" type="submit">
          Sign Up
        </Button>
      </div>

      <p className="forgot-password text-right">
        Already registered <a href="/sign-in">sign in?</a>
      </p>
    </Form>
    )
  }
}