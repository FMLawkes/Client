/* global gapi */
/* global google */
import React, { Component } from 'react'
import { withRouter } from 'next/router'
import { FaFolderOpen } from 'react-icons/fa'

import Page from '../components/page.jsx'
import Section from '../components/section.jsx'

import api from '../credentials/api'
import { filesURL } from '../configs/route-paths'

class Upload extends Component {
  constructor(props) {
    super(props)
  }

  doAuth = callback => {
    window.gapi.auth.authorize(
      {
        client_id: api.CLIENT_ID,
        scope: api.SCOPES,
        immediate: false
      },
      callback
    )
  }

  createPicker = async oauthToken => {
    const {
      result: { items: folders }
    } = await gapi.client.drive.files.list({
      q: "mimeType = 'application/vnd.google-apps.folder' and title='anifiles'",
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
    const uploadView = new google.picker.DocsUploadView().setParent(folderId)
    const picker = new google.picker.PickerBuilder()
      .addView(uploadView)
      .hideTitleBar()
      .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
      .setAppId(api.CLIENT_ID)
      .setOAuthToken(oauthToken)
      .setCallback(this.pickerCallback)
      .build()
    picker.setVisible(true)
  }

  showPicker = () => {
    const token = window.gapi.auth.getToken()
    const oauthToken = token && token.access_token
    if (oauthToken) this.createPicker(oauthToken)
    else
      this.doAuth(response => {
        if (response.access_token) this.createPicker(response.access_token)
      })
  }

  pickerCallback = async data => {
    if (data.action == google.picker.Action.PICKED) {
      /* downloadUrl, id, url */
      const { docs } = data
      for (let { id } of docs)
        await gapi.client.drive.permissions.insert({
          fileId: id,
          resource: {
            type: 'anyone',
            role: 'reader'
          }
        })
      this.props.router.push(filesURL)
    }
  }

  handleClick = () => {
    gapi.load('picker', { callback: this.showPicker })
  }

  render() {
    const pageProps = {
      ...this.props,
      title: 'Upload'
    }
    return (
      <Page {...pageProps}>
        <Section heading="Upload Files" {...this.props}>
          <div className="select-area">
            <button
              onClick={this.handleClick}
              className="btn btn-secondary btn-upload"
              type="button"
              id="pick"
            >
              <FaFolderOpen style={{ marginRight: '.5rem' }} />
              Select File
            </button>
          </div>
        </Section>
        <style jsx>{`
          .select-area {
            width: 100%;
            text-align: center;
            background: 0 0;
            padding: 60px 15px;
            border: 5px dashed #394155;
            margin-bottom: 20px;
          }
          .btn-upload {
            display: flex;
            align-items: center;
            margin: auto;
          }
        `}</style>
      </Page>
    )
  }
}

export default withRouter(Upload)
