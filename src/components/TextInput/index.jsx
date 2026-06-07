import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Text from '../Text'
import './styles.css'

function TextInput({
  className,
  label,
  subLabel,
  type,
  value,
  setValue,
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

  return (
    <div className={`text-input ${className}`}>
      <Text
        className={`is-bold ${label ? 'input-label' : ''}`}
        text={
          <span>
            {label}
            <span className="input-sublabel"> {subLabel}</span>
          </span>
        }
        size={18}
      />
      <div className="field-body">
        <div className="field">
          <p className="control">
            {icon && <i className={`input-icon-wrapper ${icon}`} />}
            {multiline ? (
              <textarea
                className={`textarea ${hasError ? 'is-danger' : ''} ${
                  icon ? 'with-icon' : ''
                }`}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoComplete={autoComplete ? 'on' : 'new-password'}
                maxLength={maxLength}
              />
            ) : (
              <input
                className={`input ${hasError ? 'is-danger' : ''} ${
                  isPassword ? 'input-with-toggle' : ''
                } ${icon ? 'with-icon' : ''}`}
                type={inputType}
                value={value}
                placeholder={placeholder}
                step="any"
                onChange={(e) => setValue(e.target.value)}
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
  className: PropTypes.string,
  label: PropTypes.string,
  subLabel: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
  autoComplete: PropTypes.bool,
  maxLength: PropTypes.number,
  multiline: PropTypes.bool,
  icon: PropTypes.string,
}

TextInput.defaultProps = {
  className: '',
  label: '',
  subLabel: '',
  value: '',
  placeholder: '',
  type: 'text',
  hasError: false,
  autoComplete: true,
  maxLength: null,
  multiline: false,
  icon: '',
}

export default TextInput
