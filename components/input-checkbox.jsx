import React from 'react'

const InputCheckbox = props => (
  <input
    type="checkbox"
    checked={props.checked}
    onChange={props.onChange}
    name={props.name}
  />
)

export default InputCheckbox
