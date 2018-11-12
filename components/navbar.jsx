import React, { Fragment } from 'react'
import Link from 'next/link'

import {
  homeURL,
  unknownURL,
  filesURL,
  uploadURL
} from '../configs/route-paths'

const Navbar = ({ router, doLogin, doLogout, isLogin, name, image }) => {
  const isHomePage = router && router.pathname === '/'
  const navbars = [
    {
      title: 'Home',
      url: homeURL
    },
    {
      title: 'Features',
      url: unknownURL
    }
  ]
  isLogin &&
    navbars.push(
      {
        title: 'Files',
        url: filesURL
      },
      {
        title: 'Upload',
        url: uploadURL
      }
    )

  return (
    <nav className="navbar navbar-expand-lg navbar-light container">
      <Link href="/">
        <a className="navbar-brand">
          <img
            src="/static/logo.png"
            height="40"
            className="d-inline-block align-top"
            alt="Anifiles"
          />
        </a>
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarTogglerDemo02"
        aria-controls="navbarTogglerDemo02"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        {!isHomePage && (
          <ul className="navbar-nav">
            {navbars.map(({ title, url }, index) => (
              <li className="nav-item" key={index}>
                <Link href={url}>
                  <a className="nav-link">{title}</a>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div className="nav navbar-nav navbar-right">
          {isLogin ? (
            <Fragment>
              <div className="profil">
                <img src={image} />
                <span className="name">{name}</span>
              </div>
              <button
                type="button"
                onClick={doLogout}
                className="btn btn-danger"
              >
                Login
              </button>
            </Fragment>
          ) : (
            <div className="btn-group" role="group" aria-label="User">
              <button
                className="btn btn-primary"
                type="button"
                onClick={doLogin}
              >
                Login
              </button>
              <button
                className="btn btn-danger"
                type="button"
                onClick={doLogin}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .navbar {
          background: 0 0;
          padding: 5px 0;
          border-radius: 0;
          border: 0;
          font-weight: 700;
        }
        .nav-item a {
          padding: 21px 15px;
          text-transform: uppercase;
          color: #fff;
        }
        .navbar-right {
          margin-left: auto;
        }
        .profil {
          margin-right: 1rem;
          display: flex;
          align-items: center;
        }
        .profil img {
          width: 34px;
          height: 34px;
          float: left;
          border-radius: 50px;
          margin-right: 5px;
        }
        .profil name {
          line-height: 13px;
        }
      `}</style>
    </nav>
  )
}

export default Navbar
