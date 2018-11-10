/* global gapi */
// /* global google */
import 'cross-fetch/polyfill'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { getDataFromTree, ApolloProvider } from 'react-apollo'
import App, { Container } from 'next/app'
import { HttpLink } from 'apollo-link-http'
import Head from 'next/head'
import loadScript from 'load-script'

import api from '../credentials/api'

const GOOGLE_SDK_URL = 'https://apis.google.com/js/api.js'
let scriptLoadingStarted = false

const createApolloClient = () =>
  new ApolloClient({
    ssrMode: typeof window !== 'undefined',
    cache: new InMemoryCache(),
    link: new HttpLink({ uri: 'https://api.anifiles.org/graphql' }),
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache'
      }
    }
  })

class Main extends App {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      name: '',
      image: '',
      isLogin: false
    }
  }

  componentDidMount() {
    if (this.isGoogleReady()) this.onApiLoad()
    else if (!scriptLoadingStarted) {
      scriptLoadingStarted = true
      loadScript(GOOGLE_SDK_URL, this.onApiLoad)
    }
  }

  isGoogleReady = () => !!window.gapi

  onApiLoad = () => {
    this.initClient()
    gapi.load('picker')
  }

  initClient = () => {
    window.gapi &&
      window.gapi.load('client:auth2', () => {
        window.gapi.client
          .init({
            apiKey: api.API_KEY,
            clientId: api.CLIENT_ID,
            discoveryDocs: api.DISCOVERY_DOCS,
            scope: api.SCOPES,
            immediate: false
          })
          .then(() => {
            gapi.auth2
              .getAuthInstance()
              .isSignedIn.listen(this.updateSigninStatus)
            this.updateSigninStatus(
              gapi.auth2.getAuthInstance().isSignedIn.get()
            )
          })
      })
  }

  updateSigninStatus = isSignedIn => {
    this.setState({
      isLogin: isSignedIn
    })
    if (isSignedIn) {
      const profile = gapi.auth2
        .getAuthInstance()
        .currentUser.get()
        .getBasicProfile()
      const name = profile.getName()
      const image = profile.getImageUrl()
      const email = profile.getEmail()
      this.setState({
        email,
        image,
        name
      })
    }
  }

  handleAuthClick = () => {
    gapi.auth2.getAuthInstance().signIn()
  }

  handleLogout = () => {
    gapi &&
      gapi.auth2
        .getAuthInstance()
        .signOut()
        .then(() => {
          this.setState({
            email: '',
            name: '',
            image: ''
          })
        })
        .catch(() => {
          this.setState({
            email: '',
            name: '',
            image: ''
          })
        })
  }

  static async getInitialProps({ ctx, router, Component }) {
    const props = {}
    if (Component.getInitialProps)
      props.pageProps = await Component.getInitialProps(ctx)

    if (ctx.req) {
      const apolloClient = createApolloClient()
      try {
        await getDataFromTree(
          <Main
            {...props}
            apolloClient={apolloClient}
            router={router}
            Component={Component}
          />
        )
      } catch (error) {
        // Prevent crash from GraphQL errors.
        // eslint-disable-next-line no-console
        console.error(error)
      }
      Head.rewind()
      props.apolloCache = apolloClient.cache.extract()
    }

    return props
  }

  apolloClient =
    this.props.apolloClient || createApolloClient(this.props.apolloCache)

  render() {
    const { Component, pageProps } = this.props
    const { isLogin, email, name, image } = this.state
    const hocProps = {
      ...pageProps,
      isLogin,
      email,
      name,
      image,
      doLogin: this.handleAuthClick,
      doLogout: this.handleLogout
    }
    return (
      <Container>
        <ApolloProvider client={this.apolloClient}>
          <Component {...hocProps} />
        </ApolloProvider>
      </Container>
    )
  }
}

export default Main
