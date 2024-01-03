import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import config from '../config';
import FormBox from './form-box'
import Cookies from 'js-cookie';
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
        if(!data.userData.first_name || !data.userData.last_name)
          Cookies.set("header_username",data.userData.username);
        else
        Cookies.set("header_username",data.userData.first_name + data.userData.last_name);
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
      <FormBox>
        <form onSubmit={handleSubmit}>
          <h3>Sign In</h3>
            <div className="mb-3 form-floating">
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Enter Username"
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
                className="form-control"
                id="password"
                placeholder="Enter Password"
                name="password"
                required
              />
              <label htmlFor="password">
                Password
              </label>
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
                name="group1"
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember Me
              </label>
            </div>
            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Sign In'}
              </button>
            </div>
            <p className="forgot-password text-right">
              Forgot <a href="#">password?</a>
            </p>
          <Link to="/account/sign-up">Create an account</Link>
        </form>
      </FormBox>
    )
}

export default Login;