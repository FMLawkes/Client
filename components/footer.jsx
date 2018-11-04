const Footer = () => (
  <footer className="footer container">
    <div className="row" id="nav">
      <div className="col">
        <a href="/terms-conditions">Term and Conditions</a>
      </div>
      <div className="col">
        <a href="/copyright">Copyright Policy</a>
      </div>
      <div className="col">
        <a href="/privacy">Privacy Policy</a>
      </div>
      <div className="col">
        <a href="/#">About US</a>
      </div>
      <div className="col">
        <a href="/#">Contact US</a>
      </div>
    </div>
    <div className="row copyright">
      <div className="col">
        <p>Copyright © 2018 Anifiles</p>
      </div>
    </div>
    <style jsx>{`
      .footer {
        text-align: center;
        padding: 1rem;
        width: 100%;
        font-weight: 600;
        font-size: 15px;
        color: rgba(170, 180, 200, 0.6);
      }
      #nav {
        width: fit-content;
        margin: auto;
      }
      .copyright {
        margin-top: 0.5rem;
      }
      .col {
        white-space: nowrap;
      }
    `}</style>
  </footer>
)

export default Footer
