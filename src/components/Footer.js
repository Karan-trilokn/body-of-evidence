import React from "react";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-7">
            <ul className="list-unstyled footer-link">
              <li>
                <a href="/terms-and-conditions" className="footer-links">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/privacy-policy" className="footer-links">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/about" className="footer-links">
                  About
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-5">
            <ul className="list-unstyled dev-by">
              <li>
                <span className="footer-links">Developed by</span>
                <a
                  href="https://www.appgurus.com.au/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="/assets/images/appgurusb-logo.svg"
                    className="img-fluid appgurusb-hs"
                    alt="AppGurus"
                  />
                  <img
                    src="/assets/images/appgurusw-logo.svg"
                    className="img-fluid appgurusw-hs"
                    alt="AppGurus"
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
