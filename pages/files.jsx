/* global gapi */
import React, { Component } from 'react'
import { withRouter } from 'next/router'
import moment from 'moment'
import loadScript from 'load-script'
import Page from '../components/page.jsx'
import Section from '../components/section.jsx'
import formatBytes from '../helpers'
import api from '../credentials/api'

const GOOGLE_SDK_URL = 'https://apis.google.com/js/api.js'
let scriptLoadingStarted = false

class Files extends Component {
  constructor(props) {
    super(props)
    this.state = {
      files: []
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
    gapi.load('client')
    this.initClient()
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
    if (isSignedIn) this.getFiles()
  }

  getFiles = async () => {
    try {
      const {
        result: { items: folders }
      } = await gapi.client.drive.files.list({
        q:
          "mimeType = 'application/vnd.google-apps.folder' and title='anifiles'",
        fields: 'nextPageToken, items(id, title)'
      })
      if (folders.length) {
        const {
          result: { items: files }
        } = await gapi.client.drive.files.list({
          maxResults: 10,
          q: `'${folders[0].id}' in parents`,
          fields: 'items(id, title, fileSize, createdDate)'
        })
        this.setState({
          files
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  handleDelete = async fileId => {
    const { files } = this.state
    if (fileId) {
      await gapi.client.drive.files.delete({
        fileId
      })
      // await this.getFiles()
      const newFiles = files.filter(({ id }) => id !== fileId)
      this.setState({
        files: newFiles
      })
    }
    return null
  }

  render() {
    const { files } = this.state
    moment('14-10-2012', 'DD-MM-YYYY', 'id', true)
    const pageProps = {
      ...this.props,
      title: 'Anifiles'
    }
    const thead = ['Name', 'Size', 'Created time', 'Action']
    return (
      <Page {...pageProps}>
        <Section heading="My Files" {...this.props}>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="thead-light">
                <tr>
                  <th>
                    <input type="checkbox" id="checkall" />
                  </th>
                  {thead.map((th, index) => (
                    <th key={index}>{th}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {files.length ? (
                  files.map(({ id, title, createdDate, fileSize }) => (
                    <tr key={id}>
                      <th>
                        <input type="checkbox" id={id} />
                      </th>
                      <td>{title}</td>
                      <td>{fileSize ? formatBytes(fileSize) : '-'}</td>
                      <td>{moment(Date(createdDate)).format('DD-MM-YYYY')}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => this.handleDelete(id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">There is no files</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Section>
      </Page>
    )
  }
}

export default withRouter(Files)
