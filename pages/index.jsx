import { withRouter } from 'next/router'

import Page from '../components/page.jsx'
import Section from '../components/section.jsx'
import { filesURL } from '../configs/route-paths'

const IndexPage = props => (
  <Page title="Anifiles" {...props}>
    <Section heading="Anifiles" {...props}>
      <div>
        <p>Easy way to share your files</p>
      </div>
      <div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={
            props.isLogin ? () => props.router.push(filesURL) : props.doLogin
          }
        >
          Manage
        </button>
      </div>
    </Section>
  </Page>
)

export default withRouter(IndexPage)
