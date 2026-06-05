import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './styles.css'

function TextInput({
  id,
  name,
  className,
  label,
  subLabel,
  type,
  value,
  setValue,
  onChange,
  placeholder,
  hasError,
  autoComplete,
  maxLength,
  multiline,
  icon,
}) {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e)
    } else if (setValue) {
      setValue(e.target.value)
    }
  }

  const inputId = id || name

  return (
    <div className={`text-input ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={`is-bold ${label ? 'input-label' : ''}`}
          style={{ display: 'block', fontSize: '18px', marginBottom: '0.5rem' }}
        >
          {label}
          {subLabel && <span className="input-sublabel"> {subLabel}</span>}
        </label>
      )}
      <div className="field-body">
        <div className="field">
          <p className={`control ${icon ? 'has-icons-left' : ''}`}>
            {multiline ? (
              <textarea
                id={inputId}
                name={name}
                className={`textarea ${hasError ? 'is-danger' : ''}`}
                value={value}
                onChange={handleChange}
                autoComplete={autoComplete ? 'on' : 'new-password'}
                maxLength={maxLength}
              />
            ) : (
              <>
                <input
                  id={inputId}
                  name={name}
                  className={`input ${hasError ? 'is-danger' : ''}`}
                  type={type}
                  value={value}
                  placeholder={placeholder}
                  step="any"
                  onChange={handleChange}
                  autoComplete={autoComplete ? 'on' : 'new-password'}
                  maxLength={maxLength}
                />
                {icon && (
                  <span className="icon is-small is-left">
                    <FontAwesomeIcon icon={icon} />
                  </span>
                )}
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

TextInput.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  subLabel: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  setValue: PropTypes.func,
  onChange: PropTypes.func,
  hasError: PropTypes.bool,
  autoComplete: PropTypes.bool,
  maxLength: PropTypes.number,
  multiline: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
}

TextInput.defaultProps = {
  id: undefined,
  name: undefined,
  className: '',
  label: '',
  subLabel: '',
  value: '',
  placeholder: '',
  type: 'text',
  setValue: undefined,
  onChange: undefined,
  hasError: false,
  autoComplete: true,
  maxLength: null,
  multiline: false,
  icon: undefined,
}

export default TextInput
