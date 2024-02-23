import React from 'react';
import '../styles/footer.css';

const Footer = () => {
  return (
      <footer className="footer">
        <div className="container p-3">
          <div className="row">
            <div className="col-md-12 text-center">
              <p>&copy; 2024 Virtual Hair Studio. All Right Reserved</p>
            </div>
            <div className="col-md-12 text-center">
                  <a href="https://www.facebook.com" className="social-icon-link">
                    <i className="bi bi-facebook social-icon"></i>
                  </a>
                  <a href="https://www.twitter.com" className="social-icon-link">
                    <i className="bi bi-twitter social-icon"></i>
                  </a>
                  <a href="https://github.com/Wen-MY/virtual-hair-studio" className="social-icon-link">
                    <i className="bi bi-github social-icon"></i>
                  </a>
            </div>
          </div>
        </div>
      </footer>
  );
}

export default Footer;
