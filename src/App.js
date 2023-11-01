import logo from './logo.svg';
import './styles/App.css';
import { Container } from 'react-bootstrap';
import Header from './components/header';
import Footer from './components/footer'
import SideNav from './components/side-navigation'


function App() {
  return (
    <div className="App">
      <Header/>
      <Container>
      <SideNav/>
      <div className='content'>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <h3>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</h3>
      </div>
      </Container>
      <Footer/>
    </div>
  );
}

export default App;
