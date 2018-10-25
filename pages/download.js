import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'next/router'

import Page from '../components/page'
import Section from '../components/section'
import api from '../credentials'
import formatBytes from '../helpers'

class Download extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      isLogin: false,
      id: '',
      loadingDDL: false,
      errorDDL: false
    }
  }

  componentDidMount() {
    const {
      query: { id }
    } = this.props.router
    const email = window.localStorage.getItem('email')
    this.setState({
      id,
      email
    })
    this.initClient()
  }

  updateSigninStatus = isSignedIn => {
    this.setState({
      isLogin: isSignedIn
    })
  }

  initClient = () => {
    const { gapi } = window
    gapi.load('client:auth2', () => {
      gapi.client
        .init({
          apiKey: api.API_KEY,
          clientId: api.CLIENT_ID,
          discoveryDocs: api.DISCOVERY_DOCS,
          scope: api.SCOPES
        })
        .then(() => {
          gapi.auth2
            .getAuthInstance()
            .isSignedIn.listen(this.updateSigninStatus)
          this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
        })
    })
  }

  handleAuthClick = () => {
    const { gapi } = window
    gapi.auth2
      .getAuthInstance()
      .signIn()
      .then(() => {
        const profile = gapi.auth2
          .getAuthInstance()
          .currentUser.get()
          .getBasicProfile()
        const email = profile.getEmail()
        this.setState({
          email
        })
        window.localStorage.setItem('email', email)
      })
  }

  insertFileIntoFolder = async (folderId, fileId) => {
    try {
      const { gapi } = window
      const body = { id: folderId }
      await gapi.client.drive.parents.insert({
        fileId,
        resource: body
      })
      return null
    } catch {
      this.setState({
        error: true
      })
    }
  }

  handleDownload = async params => {
    try {
      const { gapi } = window
      this.setState({
        loadingDDL: true
      })
      const {
        result: { items: folders }
      } = await gapi.client.drive.files.list({
        q:
          "mimeType = 'application/vnd.google-apps.folder' and title='anifiles'",
        fields: 'nextPageToken, items(id, title)'
      })
      let folderId = ''
      if (!folders.length) {
        const {
          result: { id }
        } = await gapi.client.drive.files.insert({
          resource: {
            title: 'anifiles',
            mimeType: 'application/vnd.google-apps.folder',
            copyRequiresWriterPermission: false
          }
        })
        folderId = id
      } else folderId = folders[0].id
      const {
        result: { downloadUrl, id: fileId }
      } = await gapi.client.drive.files.copy({
        fileId: params.gdriveId,
        fields: 'title, id, downloadUrl'
      })
      await this.insertFileIntoFolder(folderId, fileId)
      const ddl = downloadUrl.slice(0, -8)
      window.location.href = ddl
      this.setState({
        loadingDDL: false
      })
    } catch {
      this.setState({
        error: true
      })
    }
  }

  handleSubmit = params => {
    const { isLogin } = this.state
    if (isLogin) this.handleDownload(params)
    else this.handleAuthClick()
  }

  render() {
    const { id, email, loadingDDL } = this.state
    const VIDEO_QUERY = gql`
      query video($id: String) {
        video(id: $id) {
          _id
          filename
          gdriveId
          size
        }
      }
    `
    const DOWNLOAD = gql`
      mutation download($email: String, $videoId: String) {
        download(email: $email, videoId: $videoId) {
          _id
          filename
        }
      }
    `
    return (
      <Page title="Download">
        {id !== '' ? (
          <Query query={VIDEO_QUERY} variables={{ id }}>
            {({ loading, error, data }) => {
              if (loading) return <span>loading....</span>
              if (error) return <span>Error....</span>
              if (data && !data.video) return <span>File Not Found....</span>
              const { video } = data
              return (
                <Section heading={`Download ${video.filename}`}>
                  <div className="file-info">
                    <table className="table table-striped table-sm">
                      <tbody>
                        <tr>
                          <th scope="row">Size</th>
                          <td>{formatBytes(video.size)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <Mutation mutation={DOWNLOAD}>
                    {download => (
                      <button
                        disabled={loadingDDL ? true : false}
                        type="submit"
                        className="btn btn-primary"
                        id="btn-download"
                        onClick={e => {
                          e.preventDefault()
                          download({ variables: { email, videoId: video._id } })
                          this.handleSubmit(video)
                        }}
                      >
                        {loadingDDL ? 'Process' : 'Download'}
                      </button>
                    )}
                  </Mutation>
                </Section>
              )
            }}
          </Query>
        ) : (
          <span>loading....</span>
        )}
        <style jsx>{`
          form {
            width: fit-content;
            margin: auto;
          }
        `}</style>
      </Page>
    )
  }
}

export default withRouter(Download)
