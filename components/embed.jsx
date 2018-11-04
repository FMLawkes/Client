import React, { Component } from 'react'
import { URL } from '../configs/constants'

class Embed extends Component {
  constructor(props) {
    super(props)
    this.state = {
      link: ''
    }
  }

  componentDidMount() {
    const { asPath } = this.props
    const url = URL + asPath
    this.setState({
      link: url
    })
  }

  handleClickBtn = params => {
    const { asPath, filename } = this.props
    const url = URL + asPath
    let link
    switch (params) {
      case 'html':
        link = `<a href="${url}" title="${filename}</a>`
        break
      case 'forum':
        link = `[URL=${url}]${filename}[/URL]`
        break
      case 'link':
        link = url
        break
    }
    this.setState({
      link
    })
  }

  render() {
    const { link } = this.state
    return (
      <div className="embed">
        <div className="nv btn-group">
          <a
            className="btn btn-danger"
            role="button"
            tabIndex="0"
            onClick={e => {
              e.preventDefault()
              this.handleClickBtn('link')
            }}
          >
            Download Link
          </a>
          <a
            className="btn btn-danger"
            role="button"
            tabIndex="0"
            onClick={e => {
              e.preventDefault()
              this.handleClickBtn('html')
            }}
          >
            HTML Code
          </a>
          <a
            className="btn btn-danger"
            role="button"
            tabIndex="0"
            onClick={e => {
              e.preventDefault()
              this.handleClickBtn('forum')
            }}
          >
            Link for forums
          </a>
        </div>
        <textarea
          readOnly
          className="form-control"
          rows="3"
          id="links"
          value={link}
        />
        <br />
        <style jsx>{`
          .embed {
            margin: 2rem 0;
            width: fit-content;
          }
          .nv {
            margin-top: 2rem;
          }
        `}</style>
      </div>
    )
  }
}

Embed.defaultValue = {
  asPath: ''
}

export default Embed
