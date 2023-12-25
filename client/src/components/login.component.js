import React, { Component } from 'react'
import { Form,Row,Button,Col } from 'react-bootstrap'
export default class Login extends Component {
  state = {
    isLoading: false,
  };
  handleSubmit = async (event) => {
    event.preventDefault();

    const username = event.target.elements.username.value;
    const password = event.target.elements.password.value;
    const apiUrl = 'http://localhost:4000/user/signin';

    try {

      this.setState({ isLoading: true });
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        // Handle successful login, e.g., redirect to a new page
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData.message);
        // Handle login failure, e.g., display an error message
      }
    } catch (error) {
      console.error('Error during login:', error);
      // Handle network or other errors
    } finally {
      this.setState({ isLoading: false });
    }
  };
  render() {
    const { isLoading } = this.state;

    return (
      <Form onSubmit={this.handleSubmit}>
      <h3>Sign In</h3>

      <Form.Group as={Row} className="mb-3" controlId="formPlaintextUsername">
        <Form.Label column sm="2">
          Username
        </Form.Label>
        <Col sm="10">
          <Form.Control type="text" placeholder="Enter Username" name="username" />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
        <Form.Label column sm="2">
          Password
        </Form.Label>
        <Col sm="10">
          <Form.Control type="password" placeholder="Enter Password" name="password" />
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
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Submit'}
          </Button>
        </div>

      <p className="forgot-password text-right">
        Forgot <a href="#">password?</a>
      </p>
    </Form>
    )
  }
}