import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/form-box.css'
import config from '../../config';
import FormBox from '../../components/form-box';

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState(1);
  const [errorMessage, setErrorMessage] = useState({
    username: '',
    password: ''
  });
  const handleSubmit = async (event) => {
    event.preventDefault();
    const type = event.target.elements.type.value;
    const salonName = event.target.elements.salonName.value;
    const username = event.target.elements.username.value;
    const password = event.target.elements.password.value;
    const password2 = event.target.elements.password2.value;
    const apiUrl = config.serverUrl + '/auth/';
  
    try {
      setIsLoading(true);
      setErrorMessage({ username: '', password: '' }); // Clear previous error messages
  
      if (password === password2) {
        const validateResponse = await fetch(apiUrl + `validate/username/${username}`, {
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
              body: JSON.stringify({ type, salonName, username, password }),
            });
  
            if (createResponse.ok) {
              const createData = await createResponse.json();
              console.log('User created successfully:', createData.message);
              if (type == 2) {
                console.log('Creating owner salon...')
                await handleSalonCreation(salonName);
              } else {
                // Redirect to the login page
                window.location.href = '/account';
              }
            } else {
              const createErrorData = await createResponse.json();
              console.error('User creation failed:', createErrorData.message);
              setErrorMessage({ username: createErrorData.message });
            }
          } else {
            console.error('username is not valid:', validateData.message);
            // Display an error message or take appropriate action
            setErrorMessage({ username: 'Username existed in system, try another username.' })
          }
        } else {
          const validateErrorData = await validateResponse.json();
          console.error('username validation failed:', validateErrorData.message);
          setErrorMessage({ username: validateErrorData.message });
        }
      } else {
        console.log("Password not Same");
        setErrorMessage({ password: 'Password entered not the same.' });
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      // Handle network or other errors
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSalonCreation = async (salonName) => {
    try {
      const createResponse = await fetch(config.serverUrl + '/salon/create', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: salonName }),
      });
      if (createResponse.ok) {
        const createData = await createResponse.json();
        console.log('Salon created successfully:', createData.message);
        window.location.href = '/account';
      } else {
        const createErrorData = await createResponse.json();
        console.error('Salon creation failed:', createErrorData.message);
        // Handle user creation failure, e.g., display an error message
      }
    } catch (error) {
      console.error('Error during salon creation:', error);
    }
  }
  const handleTypeChange = (event) => {
    setType(parseInt(event.target.value));
  };
  return (
    <FormBox>
       
      <form onSubmit={handleSubmit} className='needs-validation'>
        <h3 className="mb-3" >Sign Up</h3>
        {errorMessage.username && <p className="alert alert-danger" >{errorMessage.username}</p>}
        {errorMessage.password && <p className="alert alert-danger">{errorMessage.password}</p>}
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
              required
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
              required
            />
            <label className="btn btn-outline-primary" htmlFor="salonOwner">
              Salon Owner
            </label>
          </div>
        </div>

        <div className={`mb-3 form-floating ${type === 1 ? 'd-none ' : 'd-block transition'}`}>
          <input
            type="text"
            className="form-control"
            id="salonName"
            placeholder="Enter salon name"
            name="salonName"
            required={type==2}
          />
          <label htmlFor="salonName">
            Salon name
          </label>
        </div>

        <div className="mb-3 form-floating">
          <input
            type="text"
            className={`form-control ${errorMessage.username?'border-danger':''}`}
            id="username"
            placeholder="Enter username"
            name="username"
            required
          />
          <label htmlFor="username">
            Username
          </label>
        </div>

        <div className="mb-3 form-floating">
          <input
            type="password"
            className={`form-control ${errorMessage.password?'border-danger':''}`}
            id="password"
            placeholder="Enter password"
            name="password"
            required
          />
          <label htmlFor="password">
            Password
          </label>
        </div>

        <div className="mb-3 form-floating">
          <input
            type="password"
            className={`form-control ${errorMessage.password?'border-danger':''}`}
            id="password2"
            placeholder="Confirm password"
            name="password2"
            required
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
