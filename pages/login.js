import { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import Page from '../components/page'
import Section from '../components/section'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value })
  }

  handleSubmit = e => {
    e.preventDefault()
    const { email, password } = this.state
    this.props.mutate({
      variables: { email, password },
      update(
        proxy,
        {
          data: { register }
        }
      ) {
        const data = proxy.readQuery({ query })
      }
    })
  }

  render() {
    const { email, password } = this.state
    return (
      <Page title="Login Page">
        <Section heading="Login">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Email address</label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                name="email"
                value={email}
                onChange={this.handleChange}
              />
              <small id="emailHelp" className="form-text text-muted">
                We will never share your email with anyone else.
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Password"
                name="password"
                value={password}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="exampleCheck1"
              />
              <label className="form-check-label" htmlFor="exampleCheck1">
                Check me out
              </label>
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
          <style jsx>{`
            form {
              width: fit-content;
              margin: auto;
            }
          `}</style>
        </Section>
      </Page>
    )
  }
}

export default graphql(gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      _id
      email
      token
    }
  }
`)(Login)
// export default Login
