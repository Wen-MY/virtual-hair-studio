import './styles/App.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useState,useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loader from './components/loading-spinner';

import SideNav from './components/side-navigation'
import Login from './pages/Login';
import SignUp from './pages/SignUp';

import Home from './pages/Home'
import Account from './pages/Account'
import Profile from './pages/Profile';
import Guest from './pages/Guest';
import AppointmentsList from './pages/AppointmentsList';
import AppointmentDetail from './pages/AppointmentDetail';
import Services from './pages/Services';
import NotFound from './pages/NotFound';

import config from './config';
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [retryCounter, setRetryCounter] = useState(0);//api call failure attempt

  useEffect(() => {
    const checkLoggedInStatus = async () => {
      try {
        const response = await fetch(config.serverUrl + '/auth/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        const data = await response.json();

        if (response.ok) {
          console.log('Login Status:', data.message);
          setIsLoggedIn(data.login);
        } else {
          console.error('Login Status:', data.message);
          // Retry logic with 1-second delay
          if (retryCounter < 2) {
            setRetryCounter((prevCounter) => prevCounter + 1);
            setTimeout(() => checkLoggedInStatus(), 1000);
          } else {
            setIsLoggedIn(false);
          }
        }
      } catch (error) {
        console.error('Error during login status check:', error);
        // Retry logic with 1-second delay
        if (retryCounter < 2) {
          setRetryCounter((prevCounter) => prevCounter + 1);
          setTimeout(() => checkLoggedInStatus(), 1000);
        } else {
          setIsLoggedIn(false);
        }
      }
    };

    checkLoggedInStatus();
  }, [retryCounter]);

  if (isLoggedIn == null) {
    // Wait for the API response before rendering
    return(
      <Loader/>
      );
  }
  return (
    <div className="App">
      {isLoggedIn? <SideNav />:null}
      <div className='content'>
        <div className="auth-wrapper">
          <div className="auth-inner">
          <Routes>
              {isLoggedIn ?(
              <>
                <Route path="/" element={<Home />} />
                <Route path="/account" element={<Account/>} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/appointments" element={<AppointmentsList />} />
                <Route path="/appointments/detail" element={<AppointmentDetail/>} />
                <Route path="/salon/services" element={<Services/>} />
              </>
              ):(
              <>
                <Route path="/" element={<Guest/>}/>
                <Route path="/account" element={<Login/>} />
                <Route path="/account/sign-in" element={<Login/>} />
                <Route path="/account/sign-up" element={<SignUp />} />
              </>
              )}
              <Route path='*' element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </div>
     
    
    </div>
  );
}

export default App;
