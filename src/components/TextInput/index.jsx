import React, { useState } from 'react'
import PropTypes from 'prop-types'
import './styles.css'

export default function TextInput({
  id,
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
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleInputChange = (e) => {
    if (setValue) setValue(e.target.value)
    if (onChange) onChange(e)
  }

  return (
    <div className={`text-input ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className={`is-bold ${label ? 'input-label' : ''}`}
          style={{ display: 'block', fontSize: '18px', marginBottom: '0.5rem' }}
        >
          {label}
          {subLabel && <span className="input-sublabel"> {subLabel}</span>}
        </label>
      )}
      <div className="field-body">
        <div className="field">
          <p className="control">
            {icon && <i className={`input-icon-wrapper ${icon}`} />}
            {multiline ? (
              <textarea
                id={id}
                className={`textarea ${hasError ? 'is-danger' : ''} ${
                  icon ? 'with-icon' : ''
                }`}
                value={value}
                onChange={handleInputChange}
                autoComplete={autoComplete ? 'on' : 'new-password'}
                maxLength={maxLength}
              />
            ) : (
              <input
                id={id}
                className={`input ${hasError ? 'is-danger' : ''} ${
                  isPassword ? 'input-with-toggle' : ''
                } ${icon ? 'with-icon' : ''}`}
                type={inputType}
                value={value}
                placeholder={placeholder}
                step="any"
                onChange={handleInputChange}
                autoComplete={autoComplete ? 'on' : 'new-password'}
                maxLength={maxLength}
              />
            )}
          </p>
        </div>
        {isPassword && (
          <button
            type="button"
            className="password-toggle"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
          >
            <i
              className={`fa-regular ${
                showPassword ? 'fa-eye-slash' : 'fa-eye'
              }`}
            />
          </button>
        )}
      </div>
    </div>
  )
}

TextInput.propTypes = {
  id: PropTypes.string,
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
  icon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
}

TextInput.defaultProps = {
  id: undefined,
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
