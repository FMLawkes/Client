import { FaFolderOpen } from 'react-icons/fa'
import { IconContext } from 'react-icons'

const Section = ({ heading, children, router, download = false }) => {
  const isHomePage = router && router.pathname === '/'
  return (
    <section>
      <div className="heading">
        <IconContext.Provider value={{ size: '3em', marginRight: '1em' }}>
          <FaFolderOpen />
        </IconContext.Provider>
        <h1 className="text-truncate">{heading}</h1>
      </div>
      {children}
      <style jsx>{`
        h1 {
          text-align: ${isHomePage || download ? 'center' : 'left'};
          margin-left: 0.5em;
        }
        .heading {
          display: inherit;
          margin-top: ${isHomePage ? '10%' : '1em'};
          margin-bottom: 0.5em;
          justify-content: ${isHomePage || download ? 'center' : 'left'};
          max-width: 90%;
        }
        section {
          display: flex;
          align-items: ${isHomePage || download ? 'center' : 'flex-start'};
          flex-direction: column;
          margin-bottom: 2rem;
          width: 100%;
        }
      `}</style>
    </section>
  )
}

export default Section
