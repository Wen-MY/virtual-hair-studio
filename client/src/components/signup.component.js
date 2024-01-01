import React, { useState } from 'react';
import { Form, Row, Button, Col } from 'react-bootstrap';
import config from '../config';

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const first_name = event.target.elements.firstName.value;
    const last_name = event.target.elements.lastName.value;
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;
    const apiUrl = config.serverUrl + '/user/';

    try {
      setIsLoading(true);

      const validateResponse = await fetch(apiUrl + `validate/email/${email}`, {
        method: 'GET',
      });

      if (validateResponse.ok) {
        const validateData = await validateResponse.json();

        if (validateData.valid) {
          const createResponse = await fetch(apiUrl + 'create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ first_name, last_name, email, password }),
          });

          if (createResponse.ok) {
            const createData = await createResponse.json();
            console.log('User created successfully:', createData.message);
            // Handle successful user creation, e.g., redirect or show success message
          } else {
            const createErrorData = await createResponse.json();
            console.error('User creation failed:', createErrorData.message);
            // Handle user creation failure, e.g., display an error message
          }
        } else {
          console.error('Email is not valid:', validateData.message);
          // Display an error message or take appropriate action
        }
      } else {
        const validateErrorData = await validateResponse.json();
        console.error('Email validation failed:', validateErrorData.message);
        // Handle email validation failure, e.g., display an error message
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      // Handle network or other errors
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h3>Sign Up</h3>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={2}>
          First name
        </Form.Label>
        <Col sm={10}>
          <Form.Control type="text" placeholder="First name" name="firstName" />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={2}>
          Last name
        </Form.Label>
        <Col sm={10}>
          <Form.Control type="text" placeholder="Last name" name="lastName" />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={2}>
          Email address
        </Form.Label>
        <Col sm={10}>
          <Form.Control type="email" placeholder="Enter email" name="email" />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={2}>
          Password
        </Form.Label>
        <Col sm={10}>
          <Form.Control type="password" placeholder="Enter password" name="password" />
        </Col>
      </Form.Group>

      <div className="d-grid">
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Sign Up'}
        </Button>
      </div>

      <p className="forgot-password text-right">
        Already registered <a href="/account/sign-in">sign in?</a>
      </p>
    </Form>
  );
};

export default SignUp;
