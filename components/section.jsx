const Section = ({ heading, children, router, download = false }) => {
  const isHomePage = router && router.pathname === '/'
  return (
    <section>
      <h1>{heading}</h1>
      {children}
      <style jsx>{`
        h1 {
          margin-top: ${isHomePage ? '1.5em' : '1em'};
          margin-bottom: 0.5em;
        }
        section {
          display: flex;
          align-items: ${isHomePage || download ? 'center' : 'flex-start'};
          flex-direction: column;
          margin-bottom: 2rem;
        }
      `}</style>
    </section>
  )
}

export default Section
