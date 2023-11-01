import React from 'react';
import '../styles/footer.css'
import { Container, Row, Col } from 'react-bootstrap';
import { Facebook, Twitter, Github } from 'react-bootstrap-icons'; // Import Bootstrap icons

function Footer() {
  return (
    <div>
    <footer className="footer">
      <Container>
        <Row>
          <Col xs={12} md={6} className="text-center text-md-start">
            <p>&copy; 2023 Your Company Name</p>
          </Col>
          <Col xs={12} md={6} className="text-center text-md-end">
            <a href="https://www.facebook.com">
              <Facebook className="social-icon" size={36}/>
            </a>
            <a href="https://www.twitter.com">
              <Twitter className="social-icon" size={36}/>
            </a>
            <a href="https://www.github.com">
              <Github className="social-icon" size={36} />
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
    </div>
  );
}

export default Footer;
