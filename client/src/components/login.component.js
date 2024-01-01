import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Form,Row,Button,Col } from 'react-bootstrap'
import config from '../config';
const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const username = event.target.elements.username.value;
    const password = event.target.elements.password.value;
    const apiUrl = config.serverUrl + '/user/signin';

    try {
      setIsLoading(true);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data.message);
        window.location.href = '/'; //redirect to protected home page
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData.message);
        // Handle login failure, e.g., display an error message (pending)
      }
    } catch (error) {
      console.error('Error during login:', error);
      // Handle network or other errors
    } finally {
      setIsLoading(false);
    }
  };
//change to Floating Label !!!
    return (
      <Form onSubmit={handleSubmit}>
      <h3>Sign In</h3>
      
      <Form.Group as={Row} className="mb-3" controlId="formPlaintextUsername">
        <Form.Label column sm="2">
          Username
        </Form.Label>
        <Col sm="10">
          <Form.Control type="text" placeholder="Enter Username" name="username" required/>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
        <Form.Label column sm="2">
          Password
        </Form.Label>
        <Col sm="10">
          <Form.Control type="password" placeholder="Enter Password" name="password" required/>
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
            {isLoading ? 'Loading...' : 'Sign In'}
          </Button>
        </div>

      <p className="forgot-password text-right">
        Forgot <a href="#">password?</a>
      </p>

      <Link to='/account/sign-up'>
        Create an account
      </Link>
    </Form>
    )
}

export default Login;