import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo'
import gql from 'graphql-tag'

import Page from '../components/page'
import Section from '../components/section'
import api from '../credentials/api'
import formatBytes from '../helpers'

export default class Download extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      isLogin: false,
      id: ''
    }
  }

  componentDidMount() {
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
      })
  }

  handleDownload = async params => {
    console.log(params)
    const { gapi } = window
    const {
      result: { files: folders }
    } = await gapi.client.drive.files.list({
      q: "mimeType='image/jpeg'"
    })
    let folderId = ''
    if (!folders.length) {
      const {
        result: { id }
      } = await gapi.client.drive.files.create({
        resource: {
          name: 'anifiles',
          mimeType: 'application/vnd.google-apps.folder',
          copyRequiresWriterPermission: false
        }
      })
      folderId = id
    } else folderId = folders[0].id
    const {
      result: { downloadUrl }
    } = await gapi.client.drive.files.copy({
      fileId: params.gdriveId,
      fields: 'name, id, downloadUrl',
      resource: {
        parents: [folderId]
      }
    })
    console.log(downloadUrl)
  }

  handleSubmit = params => {
    const { isLogin } = this.state
    if (isLogin) this.handleDownload(params)
    else this.handleAuthClick()
  }

  render() {
    const { email } = this.state
    const id = '5bd18eb43e0880c09295ba1d'
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
        <Query query={VIDEO_QUERY} variables={{ id }}>
          {({ loading, error, data: { video } }) => {
            if (loading) return <span>loading....</span>
            if (error) return <span>Error....</span>
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
                      type="submit"
                      className="btn btn-primary"
                      id="btn-download"
                      onClick={e => {
                        e.preventDefault()
                        download({ variables: { email, videoId: video._id } })
                        this.handleSubmit(video)
                      }}
                    >
                      Download
                    </button>
                  )}
                </Mutation>
              </Section>
            )
          }}
        </Query>
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
