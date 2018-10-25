import React, { Component } from 'react'
import Page from '../components/page'
import Section from '../components/section'

class IndexPage extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js')
  }

  render() {
    return (
      <Page title="Sharefiles">
        <Section heading="Sharefiles">STILL PROGRESS</Section>
      </Page>
    )
  }
}

export default IndexPage
