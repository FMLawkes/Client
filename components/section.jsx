const Section = ({ heading, children }) => (
  <section>
    <h1>{heading}</h1>
    {children}
    <style jsx>{`
      h1 {
        margin-top: 1.5em;
        margin-bottom: 0.5em;
        text-align: center;
      }
      section {
        display: flex;
        align-items: center;
        flex-direction: column;
        margin-bottom: 2rem;
      }
    `}</style>
  </section>
)

export default Section
