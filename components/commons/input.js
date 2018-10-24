const Input = ({ label, type, className, id }) => (
  <div className="form-group">
    <label htmlFor="exampleInputEmail1">{label}</label>
    <input
      type={type}
      className={`form-control ${className}`}
      id={id}
      aria-describedby="emailHelp"
      placeholder="Enter email"
    />
    <small id="emailHelp" className="form-text text-muted">
      We will never share your email with anyone else.
    </small>
  </div>
)

Input.defaultProps = {
  label: '',
  type: 'text',
  className: '',
  id: null
}

export default Input
