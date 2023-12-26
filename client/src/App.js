import './styles/App.css';
import Header from './components/header';
import Footer from './components/footer'
import SideNav from './components/side-navigation'
import Home from './pages/Home'
import Login from './components/login.component';
import SignUp from './components/signup.component';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
function App() {
  return (
    <div className="App">
      <Router>
      <Header/>
      <Container>
      <SideNav/>
      
      
      <div className='content'>
        <div className="auth-wrapper">
          <div className="auth-inner">
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/sign-in" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
            </Routes>
          </div>
        </div>
      </div>
     
    
    </Container>
    <Footer/>
    </Router>
    </div>
  );
}

export default App;
