/* global gapi */
import React, { Component, Fragment } from 'react'
import { /* Mutation,  */ Query } from 'react-apollo'
import { withRouter } from 'next/router'
import { FaTrashAlt, FaRegEdit } from 'react-icons/fa'
import gql from 'graphql-tag'
import moment from 'moment'
import loadScript from 'load-script'
import ReactPaginate from 'react-paginate'

import Page from '../components/page.jsx'
import Section from '../components/section.jsx'
import Loading from '../components/loading.jsx'
import Embed from '../components/embed.jsx'
import Modal from '../components/modal.jsx'
import formatBytes from '../helpers'
import api from '../credentials/api'
// import { URL } from '../configs/constants'

const GOOGLE_SDK_URL = 'https://apis.google.com/js/api.js'
let scriptLoadingStarted = false

class Files extends Component {
  constructor(props) {
    super(props)
    this.state = {
      files: [],
      isLoading: false,
      checkBox: {
        all: false
      },
      showEmbed: false,
      showModal: false,
      selectedFile: {
        id: '',
        title: ''
      },
      asPath: [],
      filename: [],
      activePage: 0
    }
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    })
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

  retrievePageOfFiles = async (result, folders, next) => {
    const res = [...result]
    try {
      const {
        result: { items: files, nextPageToken }
      } = await gapi.client.drive.files.list({
        pageToken: next ? next : null,
        q: `'${folders[0].id}' in parents`,
        fields:
          'nextPageToken, items(id, title, fileSize, createdDate, webContentLink)'
      })
      const temp = res.concat(files)
      if (nextPageToken)
        return await this.retrievePageOfFiles(temp, folders, nextPageToken)
      else return temp
    } catch (error) {
      console.log(error)
    }
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
        const files = await this.retrievePageOfFiles([], folders)
        this.setState({
          files,
          isLoading: false
        })
      }
    } catch (error) {
      console.log(error)
      this.setState({
        isLoading: false
      })
    }
  }

  handleDelete = async (fileId /* , userId */) => {
    const { files } = this.state
    if (fileId) {
      await gapi.client.drive.files.delete({
        fileId
      })
      const newFiles = files.filter(({ id }) => id !== fileId)
      this.setState({
        files: newFiles
      })
    }
    return null
  }

  handleCheckBox = (event, videos = []) => {
    const {
      target: { checked, name }
    } = event
    if (name === 'all' && videos.length) {
      const obj = {}
      videos.forEach(({ uuid }) => {
        obj[uuid] = checked
      })
      this.setState({
        checkBox: {
          [name]: checked,
          ...obj
        }
      })
    } else
      this.setState({
        checkBox: {
          ...this.state.checkBox,
          [name]: checked
        }
      })
  }

  handleShowEmbed = () => {
    const { checked, files } = this.state
    const isAllUncheck = checked.every(e => e === false)
    if (!isAllUncheck) {
      const fileId = []
      const filename = []
      const webContentLinks = []
      checked.forEach((e, index) => {
        if (e) {
          fileId.push(files[index].id)
          filename.push(files[index].title)
          webContentLinks.push(files[index].webContentLink)
        }
      })
      // const asPath = fileId.map(e => '/d/' + e)
      this.setState({
        showEmbed: true,
        asPath: webContentLinks,
        filename
      })
    } else
      this.setState({
        showEmbed: false,
        asPath: [],
        filename: []
      })
  }

  handlePageChange = pageNumber => {
    const { selected } = pageNumber
    this.setState({
      activePage: selected
    })
  }

  handleModal = () => {
    const temp = this.state.showModal
    this.setState(
      {
        showModal: !temp
      },
      () => {
        if (temp)
          this.setState({
            selectedFile: {
              title: '',
              id: ''
            }
          })
      }
    )
  }

  handleFile = (id, title) => {
    this.setState(
      {
        selectedFile: {
          id,
          title
        }
      },
      () => this.handleModal()
    )
  }

  handleChangeInputModal = ({ target: { value } }) => {
    this.setState({
      selectedFile: {
        title: value,
        id: this.state.selectedFile.id
      }
    })
  }

  handleEditFile = async () => {
    const {
      selectedFile: { id: fileId, title }
    } = this.state
    try {
      await gapi.client.drive.files.patch({
        fileId,
        resource: {
          title
        }
      })
      await this.getFiles()
      this.handleModal()
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const {
      showEmbed,
      filename,
      asPath,
      activePage,
      showModal,
      selectedFile
    } = this.state
    const { email, doLogout } = this.props
    moment('14-10-2012', 'DD-MM-YYYY', 'id', true)
    const pageProps = {
      ...this.props,
      title: 'My Files'
    }
    // const showFiles = [...files].slice(activePage * 10, activePage * 10 + 10)
    const thead = ['Name', 'Size', 'Visits', 'Created time', 'Action']
    const modalProps = {
      showModal,
      filename: selectedFile.title,
      doChange: this.handleChangeInputModal,
      hideModal: this.handleModal,
      saveChange: this.handleEditFile
    }
    const USERINFO_QUERY = gql`
      query findAniUserById($email: String) {
        findAniUserById(email: $email) {
          _id
          email
          videos {
            _id
            fileName
            fileSize
            uuid
            driveId
            visits
            createdAt
          }
        }
      }
    `
    return (
      <Page {...pageProps}>
        <Section heading="My Files" {...this.props}>
          <Query query={USERINFO_QUERY} variables={{ email }}>
            {({ loading, error, data }) => {
              const { findAniUserById } = data
              if (loading) return <Loading />
              else if (error) return <Loading />
              else if (!findAniUserById) doLogout()
              const { videos, _id: userId } = findAniUserById
              return (
                <Fragment>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="thead-light">
                        <tr>
                          <th>
                            <input
                              type="checkbox"
                              checked={!!this.state.checkBox.all}
                              onChange={e => this.handleCheckBox(e, videos)}
                              name="all"
                            />
                          </th>
                          {thead.map((th, index) => (
                            <th key={index}>{th}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {!videos.length ? (
                          <tr>
                            <td colSpan="4">There is no files</td>
                          </tr>
                        ) : (
                          [...videos]
                            .slice(activePage * 10, activePage * 10 + 10)
                            .map(
                              (
                                {
                                  _id,
                                  fileName,
                                  fileSize,
                                  uuid, // driveId,
                                  visits,
                                  createdAt
                                },
                                index
                              ) => (
                                <tr key={index}>
                                  <td>
                                    <input
                                      type="checkbox"
                                      checked={!!this.state.checkBox[uuid]}
                                      onChange={this.handleCheckBox}
                                      name={uuid}
                                    />
                                  </td>
                                  <td>{fileName}</td>
                                  <td>
                                    {fileSize ? formatBytes(fileSize) : '-'}
                                  </td>
                                  <td>{visits}</td>
                                  <td>
                                    {moment(Date(createdAt)).format(
                                      'DD-MM-YYYY'
                                    )}
                                  </td>
                                  <td>
                                    <div className="actions">
                                      <a
                                        role="button"
                                        tabIndex="0"
                                        // onClick={() => this.handleFile(id, title)}
                                        style={{
                                          marginRight: '1rem'
                                        }}
                                      >
                                        <span>
                                          <FaRegEdit />
                                        </span>
                                      </a>
                                      <a
                                        role="button"
                                        tabIndex="0"
                                        onClick={() =>
                                          this.handleDelete(_id, userId)
                                        }
                                      >
                                        <span
                                          role="button"
                                          tabIndex="0"
                                          // onClick={() => this.handleDelete(id)}
                                        >
                                          <FaTrashAlt />
                                        </span>
                                      </a>
                                    </div>
                                  </td>
                                </tr>
                              )
                            )
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ width: '100%' }}>
                    <div className="row">
                      <div className="col">
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={this.handleShowEmbed}
                        >
                          GET LINK
                        </button>
                      </div>
                      <nav aria-label="Page navigation example">
                        <ReactPaginate
                          previousLabel="previous"
                          nextLabel="next"
                          breakLabel={<a href="">...</a>}
                          breakClassName="break-me"
                          pageCount={Math.ceil(videos.length / 10)}
                          marginPagesDisplayed={2}
                          pageRangeDisplayed={5}
                          onPageChange={this.handlePageChange}
                          containerClassName="pagination"
                          activeClassName="active"
                          pageLinkClassName="page-link"
                          pageClassName="page-item"
                          nextClassName="page-item"
                          previousClassName="page-item"
                          previousLinkClassName="page-link"
                          nextLinkClassName="page-link"
                        />
                      </nav>
                    </div>
                    {showEmbed && <Embed asPath={asPath} filename={filename} />}
                    {showModal && <Modal {...modalProps} />}
                  </div>
                </Fragment>
              )
            }}
          </Query>
        </Section>
      </Page>
    )
  }
}

export default withRouter(Files)
