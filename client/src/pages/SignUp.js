import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/form-box.css'
import config from '../config';
import FormBox from '../components/form-box';

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const type = event.target.elements.type.value;
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;
    const password2 = event.target.elements.password2.value;
    const apiUrl = config.serverUrl + '/user/';
    if(password === password2){
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
              body: JSON.stringify({ type, email, password }),
            });

            if (createResponse.ok) {
              const createData = await createResponse.json();
              console.log('User created successfully:', createData.message);
              // Handle successful user creation, e.g., redirect with timeout and show success message 
              // Redirect to the login page
              window.location.href= '/account/sign-in';
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
  }else{
    console.log("Password not Same");
  }
  };

  return (
    <FormBox>
    <form onSubmit={handleSubmit}>
      <h3 className="mb-3" >Sign Up</h3>
      <div className="mb-3 ">
        <div className="form-check form-check-inline">
          <input
            type="radio"
            className="btn-check"
            id="salonClient"
            name="type"
            defaultChecked
            value={1}
          />
          <label className="btn btn-outline-success" htmlFor="salonClient">
            Salon Client
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            type="radio"
            className="btn-check"
            id="salonOwner"
            name="type"
            value={2}
          />
          <label className="btn btn-outline-primary" htmlFor="salonOwner">
            Salon Owner
          </label>
        </div>
      </div>
  
      <div className="mb-3 form-floating">
        <input
          type="email"
          className="form-control"
          id="email"
          placeholder="Enter email"
          name="email"
        />
        <label htmlFor="email">
          Email address
        </label>
      </div>
  
      <div className="mb-3 form-floating">
        <input
          type="password"
          className="form-control"
          id="password"
          placeholder="Enter password"
          name="password"
        />
        <label htmlFor="password">
          Password
        </label>
      </div>
  
      <div className="mb-3 form-floating">
        <input
          type="password"
          className="form-control"
          id="password2"
          placeholder="Confirm password"
          name="password2"
        />
        <label htmlFor="password2">
          Confirm Password
        </label>
      </div>
  
      <button
        type="submit"
        className="btn btn-primary mb-3"
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Sign Up'}
      </button>
  
      <p className="forgot-password text-right">
        Already registered{' '}
        <Link to="/account/sign-in">sign in?</Link>
      </p>
    </form>
    </FormBox>
  );
};

export default SignUp;
