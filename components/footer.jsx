import Link from 'next/link'

const Footer = () => (
  <footer className="footer container">
    <div className="row" id="nav">
      <div className="col">
        <Link href="/terms">Term and Conditions</Link>
      </div>
      <div className="col">
        <Link href="/copyright">Copyright Policy</Link>
      </div>
      <div className="col">
        <Link href="/privacy">Privacy Policy</Link>
      </div>
      <div className="col">
        <Link href="/#">About US</Link>
      </div>
      <div className="col">
        <Link href="/#">Contact US</Link>
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
