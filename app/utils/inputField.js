import React from 'react';

const getFormType = (formType, input, label, type, options) => {
  switch (formType) {
    case "select":
      return (
        <select {...input}>
          {
            options.map(val => <option key={val.toLowerCase().replace(/\s/g, '_')} value={val.toLowerCase().replace(/\s/g, '_')}>{val}</option>)
          }
        </select>
      )
    default:
      return <input {...input} placeholder={label} type={type} />
  }
}

const inputField = ({ className, options, input, label, formType = "input", type, meta: { touched, error, warning, visited }}) => (
  <div className={className}>
    <label>{label}</label>
    <div>
      {getFormType(formType, input, label, type, options)}
      {touched && ((error && <div className="validation--error">* {error}</div>) || (warning && <div className="validation--warning">* {warning}</div>))}
    </div>
  </div>
);

export default inputField;