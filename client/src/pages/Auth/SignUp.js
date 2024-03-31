import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/form-box.css'
import config from '../../config';
import FormBox from '../../components/form-box';

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [type,setType] = useState(1);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const type = event.target.elements.type.value;
    const salonName = event.target.elements.salonName.value;
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;
    const password2 = event.target.elements.password2.value;
    const apiUrl = config.serverUrl + '/auth/';
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
              credentials: 'include',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ type,salonName, email, password }),
            });

            if (createResponse.ok) {
              const createData = await createResponse.json();
              console.log('User created successfully:', createData.message);
              if(type == 2){
                console.log('Creating owner salon...')
                await handleSalonCreation(salonName);
              }else{
                // Redirect to the login page
                window.location.href= '/account';
              }
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
  const handleSalonCreation = async (salonName) => {
    try{
    const createResponse = await fetch(config.serverUrl + '/salon/create', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name : salonName}),
    });
    if (createResponse.ok) {
      const createData = await createResponse.json();
      console.log('Salon created successfully:', createData.message);
      window.location.href= '/account';
    } else {
      const createErrorData = await createResponse.json();
      console.error('Salon creation failed:', createErrorData.message);
      // Handle user creation failure, e.g., display an error message
    }}catch (error) {
      console.error('Error during salon creation:', error);
    } 
  }
  const handleTypeChange = (event) => {
    setType(parseInt(event.target.value));
  };
  return (
    <FormBox className={``}>
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
            onChange={handleTypeChange}
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
            onChange={handleTypeChange}
          />
          <label className="btn btn-outline-primary" htmlFor="salonOwner">
            Salon Owner
          </label>
        </div>
      </div>
    
      <div className={`mb-3 form-floating ${type === 1? 'd-none ':'d-block transition'}`}>
        <input
          type="text"
          className="form-control"
          id="salonName"
          placeholder="Enter salon name"
          name="salonName"
        />
        <label htmlFor="salonName">
          Salon name
        </label>
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
