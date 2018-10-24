import Head from 'next/head'

const Page = ({ title, children }) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#ffffff" />
      <link rel="manifest" href="/static/manifest.webmanifest" />
      <link rel="icon" sizes="192x192" href="/static/icon.png" />
      <link rel="apple-touch-icon" href="/static/launcher-icon.png" />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css"
      />
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
      />
    </Head>
    <div className="container">{children}</div>
    <style jsx global>{`
      html {
        font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial,
          sans-serif;
        background-color: white;
      }
      body {
        margin: 2rem;
      }
      .container {
        border: 1px solid black;
        padding: 1rem;
      }
      .login {
        width: 80%;
      }
    `}</style>
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" />
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" />
  </div>
)

export default Page
