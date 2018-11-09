import Link from 'next/link'

import {
  termsURL,
  copyrightURL,
  privacyURL,
  unknownURL
} from '../configs/route-paths'

const Footer = () => {
  const footers = [
    {
      title: 'Term and Conditions',
      url: termsURL
    },
    {
      title: 'Copyright Policy',
      url: copyrightURL
    },
    {
      title: 'Privacy Policy',
      url: privacyURL
    },
    {
      title: 'About US',
      url: unknownURL
    },
    {
      title: 'Contact US',
      url: unknownURL
    }
  ]
  return (
    <footer className="footer container">
      <div className="row" id="nav">
        {footers.map(({ title, url }, index) => (
          <div className="col" key={index}>
            <Link href={url}>
              <a>{title}</a>
            </Link>
          </div>
        ))}
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
}

export default Footer
