import React, { Component } from 'react'
import { withRouter } from 'next/router'
import loadScript from 'load-script'
import moment from 'moment'

import Page from '../components/page.jsx'
import Section from '../components/section.jsx'
import Embed from '../components/embed.jsx'
import Loading from '../components/loading.jsx'

import formatBytes from '../helpers'
import api from '../credentials/api'

const GOOGLE_SDK_URL = 'https://apis.google.com/js/api.js'
let scriptLoadingStarted = false

class DownloadDrive extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileId: '',
      asPath: '',
      createdData: '',
      title: '',
      fileSize: '',
      isLoading: true,
      isError: false,
      webContentLink: ''
    }
  }

  componentDidMount() {
    const {
      router: {
        asPath,
        query: { id: fileId }
      }
    } = this.props
    this.setState(
      {
        asPath,
        fileId
      },
      () => {
        if (this.isGoogleReady()) this.onApiLoad()
        else if (!scriptLoadingStarted) {
          scriptLoadingStarted = true
          loadScript(GOOGLE_SDK_URL, this.onApiLoad)
        }
      }
    )
  }

  isGoogleReady = () => !!window.gapi

  onApiLoad = () => {
    this.initClient()
  }

  initClient = () => {
    const { gapi } = window
    gapi.load('client:auth2', () => {
      gapi.client
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
          this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
        })
    })
  }

  updateSigninStatus = isSignedIn => {
    this.setState({
      isLogin: isSignedIn
    })
    if (isSignedIn) this.getFiles()
  }

  getFiles = async () => {
    const { gapi } = window
    const { fileId } = this.state
    try {
      const {
        result: { createdData, title, fileSize, webContentLink }
      } = await gapi.client.drive.files.get({
        fileId
      })
      this.setState({
        createdData,
        title,
        fileSize,
        isLoading: false,
        webContentLink
      })
    } catch (error) {
      this.setState({
        isLoading: false,
        isError: true
      })
      console.log(error)
    }
  }

  goDownload = () => {
    window.location.href = this.state.webContentLink
  }

  handleLoadingError = () => {
    const {
      asPath,
      title,
      fileSize,
      createdDate,
      isLoading,
      isError
    } = this.state
    if (isLoading) return <Loading />
    else if (isError)
      return <Section heading="File Not Found" {...this.props} download />
    return (
      <Section heading={('Download', title)} {...this.props} download>
        <div className="file-info">
          <div className="table-responsive-md">
            <table className="table">
              <tbody>
                <tr>
                  <td>
                    Filename
                    <br />
                    Size
                    <br />
                    Uploaded
                  </td>
                  <td>
                    : {title}
                    <br />: {formatBytes(fileSize)}
                    <br />:
                    {moment(Date(createdDate)).format(`
                      DD MMM, YYYY`)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          id="btn-download"
          onClick={e => {
            e.preventDefault()
            this.goDownload()
          }}
        >
          Download File
        </button>
        <Embed asPath={[asPath]} filename={[title]} />
        <style jsx>{`
          .file-info {
            text-align: left;
            margin-top: 2rem;
            margin-bottom: 2rem;
          }
        `}</style>
      </Section>
    )
  }

  render() {
    const { title } = this.state
    const { isLogin, doLogin, doLogout, image, name, router } = this.props
    const pageProps = {
      title: `Download ${title}`,
      isLogin,
      doLogin,
      doLogout,
      name,
      image,
      router
    }
    return <Page {...pageProps}>{this.handleLoadingError()}</Page>
  }
}

export default withRouter(DownloadDrive)
