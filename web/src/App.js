import './styles/App.css';
import Header from './components/header';
import Footer from './components/footer'
import SideNav from './components/side-navigation'
import Login from './components/login.component';
import SignUp from './components/signup.component';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
function App() {
  return (
    <div className="App">
      <Header/>
      <Container>
      <SideNav/>
      <Router>
      
      <div className='content'>
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" to={'/sign-in'}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={'/sign-up'}>
                    Sign up
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="auth-wrapper">
          <div className="auth-inner">
            <Routes>
              <Route exact path="/" element={<Login />} />
              <Route path="/sign-in" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
            </Routes>
          </div>
        </div>
      </div>
     
    </Router>
    </Container>
    <Footer/>
    </div>
  );
}

export default App;
