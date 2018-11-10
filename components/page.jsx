/* global window */
import React, { Fragment } from 'react'
import Head from 'next/head'

import { homeURL } from '../configs/route-paths'
import Navbar from './navbar.jsx'
import Footer from './footer.jsx'

const Page = ({
  children,
  router,
  title,
  doLogin,
  doLogout,
  isLogin,
  name,
  image
}) => {
  const navProps = {
    doLogin,
    doLogout,
    isLogin,
    name,
    image,
    router
  }
  const { pathname, push } = router
  const securePaths = ['/files', '/upload']
  const isSecure = securePaths.find(e => e === pathname)
  if (!isLogin && isSecure) push(homeURL)
  return (
    <Fragment>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/static/manifest.webmanifest" />
        <link rel="icon" sizes="192x192" href="/static/icon.png" />
        <link rel="apple-touch-icon" href="/static/launcher-icon.png" />
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        />
      </Head>
      <header>
        <Navbar {...navProps} />
      </header>
      <main role="main" className="container">
        {children}
      </main>
      <Footer />
      <style jsx global>{`
        html {
          position: relative;
          min-height: 100%;
        }
        body {
          height: 100%;
          background: #262831;
          font-family: Roboto, sans-serif;
          color: #fff;
          font-size: 15px;
          margin: 0 auto;
          text-rendering: optimizeLegibility;
          margin-bottom: 65px;
        }
        #__next {
          width: 100%;
          height: 100%;
        }
        main {
          display: flex;
          min-height: 75vh;
        }
        .loading {
          margin: auto;
        }
        .table .thead-light th {
          color: #fff;
          background-color: #6c757d;
          border-color: #dee2e6;
        }
        .actions {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        span svg {
          fill: #6c757d;
        }
        .page-link {
          background-color: #1d212b;
          border-color: #475470;
          color: #fff;
        }
        .page-item.active .page-link {
          background-color: #6c757d;
          border-color: #475470;
        }
        .page-item.disabled {
          display: none;
          border-color: #475470;
        }
        a {
          color: #fff;
        }
      `}</style>
      {/* <script async defer src="https://apis.google.com/js/api.js" /> */}
      <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" />
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" />
    </Fragment>
  )
}

export default Page
