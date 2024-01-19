import './styles/App.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useState,useEffect } from 'react';
import SyncLoader from 'react-spinners/SyncLoader'
import SideNav from './components/side-navigation'
import Home from './pages/Home'
import Account from './pages/Account'
import Profile from './pages/Profile';
import { Routes, Route } from 'react-router-dom';
import Guest from './pages/Guest';
import Login from './components/login.component';
import SignUp from './components/signup.component';
import config from './config';
import Cookies from 'js-cookie';
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  useEffect(() => {
      const checkLoggedInStatus = async () => {
        try {
          const response = await fetch(config.serverUrl + '/auth/',{
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: 'include'
          });
          const data = await response.json();
          if (response.ok) {
            console.log('Login Status :', data.message)
          } else {
            console.error('Login Status:', data.message);
          }
          setIsLoggedIn(data.login);
        } catch (error) {
          // Handle error
          console.error('Error during login status check:', error);
        }
        if(!isLoggedIn){
          Cookies.remove("header_username");
        }
      };
      checkLoggedInStatus();
  }, []);
  console.log(isLoggedIn);
  if (isLoggedIn == null) {
    // Wait for the API response before rendering
    return(
      <div className='loading'>
          <SyncLoader
          color="#36d7b7"
          margin={3}
          speedMultiplier={1}
          />
      </div>
      );
  }
  return (
    <div className="App">
      {isLoggedIn? <SideNav />:null}
      <div className='content'>
        <div className="auth-wrapper">
          <div className="auth-inner">
              {isLoggedIn ?(
                <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/account" element={<Account/>} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
              ):(
                <Routes>
                <Route path="/" element={<Guest/>}/>
                <Route path="/account" element={<Login/>} />
                <Route path="/account/sign-in" element={<Login/>} />
                <Route path="/account/sign-up" element={<SignUp />} />
              </Routes>
              )}
          </div>
        </div>
      </div>
     
    
    </div>
  );
}

export default App;
