import './styles/App.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useState,useEffect } from 'react';
import { Routes, Route,  Navigate } from 'react-router-dom';
import Loader from './components/loading-spinner';

import SideNav from './components/side-navigation'

import Guest from './pages/Guest';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';

import Home from './pages/Home'
import Account from './pages/Account/Account'

import Salon from './pages/Salon/Salon';
import SalonDashboard from './pages/Salon/SalonDashboard';
import SalonExplore from './pages/Salon/SalonExplore';
import SalonManagement from './pages/Salon/SalonManagement';

import AppointmentsList from './pages/Appointment/AppointmentsList';
import AppointmentDetail from './pages/Appointment/AppointmentDetail';
import AppointmentCreation from './pages/Appointment/AppointmentCreation'
import AppointmentReschedule from './pages/Appointment/AppointmentReschedule';

import TryOn from './pages/Try-on/TryOn';
import TryOnHairstyle from './pages/Try-on/TryOnHairstyle'

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
      <div className={`content${isLoggedIn? ' left-indent p-4':''}`}>
          <Routes>
              {isLoggedIn ?(
              <>
                <Route path="/" element={<Home />} />
                <Route path="/account" element={<Account/>} />
                <Route path="/salon/:salonId" element={<Salon />} />
                <Route path="/appointments" element={<AppointmentsList />} />
                <Route path="/appointments/detail" element={<AppointmentDetail/>} />
                <Route path="/salon/management" element={<SalonManagement/>} />
                <Route path="/appointment/create" element={<AppointmentCreation />}/>
                <Route path="/explore" element={<SalonExplore />}/>
                <Route path="/appointment/reschedule" element={<AppointmentReschedule/>}/>
                <Route path="/try-on" element={<TryOn />}/>
                <Route path="/try-on/hairstyle" element={<TryOnHairstyle/>}/>
                <Route path="/salon/dashboard" element ={<SalonDashboard/>}/>
              </>
              ):(
              <>
                <Route path="/" element={<Guest/>}/>
                <Route path="/account" element={<Navigate to="/account/sign-in" replace />} />
                <Route path="/account/sign-in" element={<Login/>} />
                <Route path="/account/sign-up" element={<SignUp />} />
              </>
              )}
              <Route path='*' element={<NotFound />} />
            </Routes>
      </div>
     
    
    </div>
  );
}

export default App;
