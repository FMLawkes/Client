import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo'
import { withRouter } from 'next/router'
import gql from 'graphql-tag'
import swal from 'sweetalert'
import moment from 'moment'

import Page from '../components/page.jsx'
import Section from '../components/section.jsx'
import Embed from '../components/embed.jsx'

import api from '../credentials/api.js'
import formatBytes from '../helpers'

class Download extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      isLogin: false,
      id: '',
      loadingDDL: false,
      errorDDL: false,
      asPath: '',
      embed: 'download'
    }
  }

  componentDidMount() {
    const {
      query: { id },
      asPath
    } = this.props.router
    const email = window.localStorage.getItem('email')
    this.setState({
      id,
      email,
      asPath
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
      swal('Oops!', 'Something went wrong!', 'error')
      this.setState({
        errorDDL: true
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
    } catch ({
      result: {
        error: { message }
      }
    }) {
      this.setState(
        {
          loadingDDL: false,
          errorDDL: true
        },
        () => {
          if (message === 'The user has exceeded their Drive storage quota')
            swal(
              'Penyimpanan Google Drive anda tidak cukup!',
              'Silakan hapus beberapa file agar bisa mendownload',
              'warning'
            )
          else swal('Oops!', 'Something went wrong!', 'error')
        }
      )
    }
  }

  handleSubmit = params => {
    const { isLogin } = this.state
    if (isLogin) this.handleDownload(params)
    else this.handleAuthClick()
  }

  // handleEmbed = params => {
  //   const { asPath } = this.state
  //   let temp = URL + asPath
  //   switch (params) {
  //     case 'html':
  //       temp = `<a href="${temp}" title="Copy of 2049015 - Gund SeeDest 480p MegumiNime.rar">Copy of 2049015 - Gund SeeDest 480p MegumiNime.rar</a>`
  //       break;
  //     default:
  //       break;
  //   }
  //   return temp
  // }

  render() {
    const { id, email, loadingDDL, errorDDL, asPath } = this.state
    moment.locale('en')
    const VIDEO_QUERY = gql`
      query fs3ByShortUrl($shortUrl: String) {
        fs3ByShortUrl(shortUrl: $shortUrl) {
          _id
          filename
          video {
            _id
            gdriveId
            filename
            size
            createdAt
          }
        }
      }
    `
    const DOWNLOAD = gql`
      mutation downloadByVideoId($email: String, $videoId: String) {
        downloadByVideoId(email: $email, videoId: $videoId) {
          _id
          filename
        }
      }
    `
    let handleTextButton = 'Download Now'
    if (loadingDDL) handleTextButton = 'Processing'
    else if (errorDDL) handleTextButton = 'Failed'
    return (
      <Page title="Download">
        {id !== '' ? (
          <Query query={VIDEO_QUERY} variables={{ shortUrl: id }}>
            {({ loading, error, data }) => {
              if (loading) return <span>loading....</span>
              if (error) return <span>Error....</span>
              const { fs3ByShortUrl } = data
              if (!fs3ByShortUrl) return <span>File Not Found....</span>
              const { video } = fs3ByShortUrl
              return (
                <Section heading={`Download ${video.filename}`}>
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
                              : {video.filename}
                              <br />: {formatBytes(video.size)}
                              <br />:
                              {moment(Date(video.createdAt)).format(`
                                D MMM, YYYY`)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <Mutation mutation={DOWNLOAD}>
                    {download => (
                      <button
                        disabled={loadingDDL || errorDDL ? true : false}
                        type="submit"
                        className="btn btn-primary"
                        id="btn-download"
                        onClick={e => {
                          e.preventDefault()
                          download({ variables: { email, videoId: video._id } })
                          this.handleSubmit(video)
                        }}
                      >
                        {handleTextButton}
                      </button>
                    )}
                  </Mutation>
                  {errorDDL && (
                    <div>
                      <p>Silakan reload/refresh untuk mencoba lagi</p>
                    </div>
                  )}
                  <Embed asPath={asPath} filename={video.filename} />
                </Section>
              )
            }}
          </Query>
        ) : (
          <span>loading....</span>
        )}
        <style jsx>{`
          .file-info {
            text-align: left;
            margin-top: 2rem;
            margin-bottom: 2rem;
          }
        `}</style>
      </Page>
    )
  }
}

export default withRouter(Download)
