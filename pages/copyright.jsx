import { withRouter } from 'next/router'

import Page from '../components/page.jsx'
import Section from '../components/section.jsx'

const Copyright = props => (
  <Page title="Copyright Policy" {...props}>
    <Section heading="Copyright Policy" {...props}>
      <p>
        Anifiles&nbsp;intends to fully comply with the Digital Millennium
        Copyright Act (&quot;DMCA&quot;), including the notice and &quot;take
        down&quot; provisions, and to benefit from the safe harbors immunizing
        Anifiles&nbsp;from liability to the fullest extent of the law.
        Anifiles&nbsp;reserves the right to terminate the account of any Member
        who infringes upon the copyright rights of others upon receipt of proper
        notification by the copyright owner or the copyright owner&apos;s legal
        agent. If you believe that your work has been copied in a way that
        constitutes copyright infringement, or that your intellectual property
        rights have been otherwise violated, please provide Anifiles&apos;s
        Copyright Agent with the following information:
      </p>
      <ul>
        <li>
          An electronic or physical signature of the person authorized to act on
          behalf of the owner (the &quot;Complainant:) of the copyright or other
          intellectual property interest that has allegedly been infringed.
        </li>
        <li>
          A description of the copyrighted work or other intellectual property
          that the Complainant claims has been infringed.
        </li>
        <li>
          A description of where the infringing material or activity that the
          Complainant is located on the Site, with enough detail that we may
          find it on the Site (e.g., Profile ID).
        </li>
        <li>
          The name, address, telephone number and email address of the
          Complainant.
        </li>
        <li>
          A statement by the Complainant that upon a good faith belief the
          disputed use of the material or activity is not authorized by the
          copyright or intellectual property owner, its agent or the law.
        </li>
        <li>
          A statement by the Complainant made under penalty of perjury, that the
          Complainant is the copyright or intellectual property owner or is
          authorized to act on behalf of the copyright or intellectual property
          owner and that the information provided in the notice is accurate.
        </li>
      </ul>
      <p>
        Please provide the video URL when filing a DMCA complain: e.g:
        <strong>https://fs3.anifiles.org/xxxxxx</strong> Written notice should
        be sent to our designated agent as follows: - via email:&nbsp;
        <strong>copyright@anifiles.org</strong>
      </p>
    </Section>
  </Page>
)

export default withRouter(Copyright)
