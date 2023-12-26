import './styles/App.css';
import Header from './components/header';
import Footer from './components/footer'
import SideNav from './components/side-navigation'
import Home from './pages/Home'
import Account from './pages/Account'
import Profile from './pages/Profile';
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
              <Route path="/account/*" element={<Account />} />
              <Route path="/profile" element={<Profile />} />
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
