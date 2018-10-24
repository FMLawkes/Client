import Page from '../components/page'
import Section from '../components/section'
// import UploadFile from '../components/UploadFile'
import UploadFileList from '../components/UploadFileList'
// import UploadBlob from '../components/UploadBlob'
// import Uploads from '../components/uploads'

const IndexPage = () => (
  <Page title="Apollo upload examples">
    <Section heading="Upload FileList">
      <UploadFileList />
    </Section>
    {/* <Section heading="Upload File">
      <UploadFile />
    </Section>
    <Section heading="Upload Blob">
      <UploadBlob />
    </Section>
    <Section heading="Uploads">
      <Uploads />
    </Section> */}
  </Page>
)

export default IndexPage
