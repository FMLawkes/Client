/* global gapi */
/* global google */
import React, { Component } from 'react'
import { withRouter } from 'next/router'
import { FaFolderOpen } from 'react-icons/fa'

import Page from '../components/page.jsx'
import Section from '../components/section.jsx'

// import api from '../credentials/api'

class Upload extends Component {
  constructor(props) {
    super(props)
  }

  // componentDidMount() {
  //   gapi.load('picker', { callback: this.showPicker })
  // }

  showPicker = async () => {
    const origin = window.location.protocol + '//' + window.location.host
    const oauthToken = await gapi.auth2
      .getAuthInstance()
      .currentUser.get()
      .getAuthResponse().id_token
    var view = new google.picker.View(google.picker.ViewId.DOCS)
    view.setMimeTypes('image/png,image/jpeg,image/jpg')
    var picker = new google.picker.PickerBuilder()
      .setOrigin(origin)
      .enableFeature(google.picker.Feature.NAV_HIDDEN)
      .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
      .setAppId('585617023855')
      .setOAuthToken(oauthToken)
      .addView(view)
      .addView(new google.picker.DocsUploadView())
      .setDeveloperKey('AIzaSyDvtiR3Ld1MJksza74z0DIA6VcXCxrByrk')
      .setCallback(this.pickerCallback)
      .build()
    picker.setVisible(true)
    console.log(picker)
    // const uploadView = new google.picker.DocsUploadView()
    // const view = new google.picker.View(google.picker.ViewId.DOCS)
    // this.picker = new google.picker.PickerBuilder()
    //   .addView(google.picker.ViewId.DOCS)
    //   .addView(uploadView)
    //   .enableFeature(google.picker.Feature.NAV_HIDDEN)
    //   .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
    //   .setAppId(api.CLIENT_ID)
    //   .setDeveloperKey('AIzaSyDvtiR3Ld1MJksza74z0DIA6VcXCxrByrk')
    //   .setOAuthToken(oauthToken)
    //   .setCallback(this.pickerCallback)
    //   .build()
    //   .setVisible(true)

    // uploadView.setIncludeFolders(true)
    // view.setMimeTypes('image/png,image/jpeg,image/jpg')
    // var picker = new google.picker.PickerBuilder()
    //   .enableFeature(google.picker.Feature.NAV_HIDDEN)
    //   .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
    //   .setAppId('585617023855')
    //   .setOAuthToken(oauthToken)
    //   .addView(google.picker.ViewId.DOCS)
    //   .addView(uploadView)
    //   .addView(new google.picker.DocsUploadView())
    //   .setDeveloperKey('AIzaSyDvtiR3Ld1MJksza74z0DIA6VcXCxrByrk')
    //   .setCallback(this.pickerCallback)
    //   .build()
    // console.log(picker)
    // picker.setVisible(true)
  }

  pickerCallback = data => {
    if (data.action == google.picker.Action.PICKED) {
      var fileId = data.docs[0].id
      alert('The user selected: ' + fileId)
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
              className="btn btn-success"
              type="button"
              id="pick"
            >
              <FaFolderOpen />
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
        `}</style>
      </Page>
    )
  }
}

export default withRouter(Upload)
