import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import config from '../../config';
import FormBox from '../../components/form-box'
const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    username: '',
    password: ''
  });
  const handleSubmit = async (event) => {
    event.preventDefault();

    const username = event.target.elements.username.value;
    const password = event.target.elements.password.value;
    const apiUrl = config.serverUrl + '/auth/signin';

    try {
      setIsLoading(true);
      setErrorMessage({ username: '', password: '' });
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
        if (errorData.message == 'User not found.') {
          setErrorMessage({ username: errorData.message });
        } else if (errorData.message == 'Invalid credentials.') {
          setErrorMessage({ password: errorData.message });
        }
        // Handle login failure, e.g., display an error message (pending)
      }
    } catch (error) {
      console.error('Error during login:', error);
      // Handle network or other errors
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <FormBox>
      <form onSubmit={handleSubmit} className='needs-validation'>
        <h3>Sign In</h3>
        {errorMessage.username && <p className="alert alert-danger" >{errorMessage.username}</p>}
        {errorMessage.password && <p className="alert alert-danger">{errorMessage.password}</p>}
        <div className="mb-3 form-floating">
          <input
            type="text"
            className={`form-control ${errorMessage.username ? 'border-danger' : ''}`}
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
            className={`form-control ${errorMessage.password ? 'border-danger' : ''}`}
            id="password"
            placeholder="Enter Password"
            name="password"
            required
          />
          <label htmlFor="password">
            Password
          </label>

        </div>
        <div className="d-grid mb-3">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Sign In'}
          </button>
        </div>
        <Link to="/account/sign-up">Create an account</Link>
      </form>
    </FormBox>
  )
}

export default Login;