import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import useResumeParser from '../../hooks/useResumeParser'
import './styles.css'

function ResumeUploader({ onExtracted, disabled }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState(null)
  const { parseResume, loading, error } = useResumeParser()

  const handleFile = async (file) => {
    if (!file) return
    setFileName(file.name)
    const data = await parseResume(file)
    if (data) onExtracted(data)
  }

  const onInputChange = (e) => handleFile(e.target.files[0])

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const onDragOver = (e) => {
    e.preventDefault()
    setDragging(true)
  }

  const onDragLeave = () => setDragging(false)

  return (
    <div className="resume-uploader-wrapper">
      <p className="resume-uploader-label">
        Preencher automaticamente com currículo
      </p>

      <div
        className={[
          'resume-dropzone',
          dragging ? 'dragging' : '',
          loading ? 'loading' : '',
          disabled ? 'disabled' : '',
        ]
          .join(' ')
          .trim()}
        onClick={() => !loading && !disabled && inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        aria-label="Área de upload de currículo"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          style={{ display: 'none' }}
          onChange={onInputChange}
          disabled={loading || disabled}
        />

        {loading ? (
          <div className="resume-status">
            <span className="resume-spinner" aria-hidden="true" />
            <span>Analisando currículo...</span>
          </div>
        ) : (
          <div className="resume-status">
            <span className="resume-icon" aria-hidden="true">
              📄
            </span>
            <span className="resume-main-text">
              {fileName
                ? `${fileName} — clique para trocar`
                : 'Clique ou arraste seu currículo aqui'}
            </span>
            <span className="resume-sub-text">PDF - max. 10 MB</span>
          </div>
        )}
      </div>

      {error && (
        <p className="resume-error" role="alert">
          {error}
        </p>
      )}

      {!error && fileName && !loading && (
        <p className="resume-success" role="status">
          Campos preenchidos - revise e salve.
        </p>
      )}
    </div>
  )
}

ResumeUploader.propTypes = {
  onExtracted: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
}

ResumeUploader.defaultProps = {
  disabled: false,
}

export default ResumeUploader
