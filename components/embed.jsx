import React, { Component } from 'react'
import { URL } from '../configs/constants'

class Embed extends Component {
  constructor(props) {
    super(props)
    this.state = {
      link: []
    }
  }

  componentDidMount() {
    const { asPath } = this.props
    const link = asPath.map(e => URL + e)
    this.setState({
      link
    })
  }

  componentDidUpdate() {
    const { link: oldState } = this.state
    const { asPath } = this.props
    if (oldState.length !== asPath.length) {
      const newState = asPath.map(e => URL + e)
      this.setState({
        link: newState
      })
    }
  }

  handleClickBtn = params => {
    const { asPath, filename } = this.props
    let link
    switch (params) {
      case 'html':
        link = asPath.map(
          (e, idx) =>
            `<a href="${URL + e}" title="${filename[idx]}">${filename[idx]}</a>`
        )
        break
      case 'forum':
        link = asPath.map((e, idx) => `[URL=${URL + e}]${filename[idx]}[/URL]`)
        break
      case 'link':
        link = asPath.map(e => URL + e)
        break
    }
    this.setState({
      link
    })
  }

  render() {
    const { link } = this.state
    const value = link.join('\n')
    return (
      <div className="embed">
        <div className="nv btn-group">
          <a
            className="btn btn-primary btn-sm"
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
            className="btn btn-secondary btn-sm"
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
            className="btn btn-warning btn-sm"
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
          value={value}
        />
        <br />
        <style jsx>{`
          .embed {
            margin: 2rem 0;
            width: 100%;
          }
          .nv {
            margin-top: 2rem;
          }
          textarea {
            border: none;
            margin-top: 0.5rem;
            font-size: 0.875rem;
            width: 100%;
          }
          .form-control:disabled,
          .form-control[readonly] {
            opacity: 1;
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
