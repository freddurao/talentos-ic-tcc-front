import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import './style.css'
import LinesEllipsis from 'react-lines-ellipsis'
import { Button } from '../FormElements'
import { localDate } from '../../utils/conversions'
import { HOME_URL } from '../../api'

function JobCard({ data }) {
  const { title, description, site, endingDate, id, companyId } = data

  return (
    <div className="job">
      <div className="job-top-container">
        <div className="description-container">
          <h3>
            <div className="is-flex is-align-items-center is-justify-content-between">
              <span>{title}</span>
              {companyId && (
                <span
                  className="tag is-success is-light font-weight-bold ml-2 py-2 px-3 border-radius-8"
                  style={{ fontSize: '12px' }}
                >
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="mr-1 text-success"
                  />{' '}
                  Oficial
                </span>
              )}
            </div>
            <sub>{site}</sub>
          </h3>
          <LinesEllipsis
            text={description}
            maxLine="10"
            ellipsis="..."
            trimRight
            basedOn="letters"
          />
        </div>
        <span className="due-date">Expira em: {localDate(endingDate)}</span>
      </div>
      <div>
        <Button
          label="Ver mais detalhes"
          scheme="blue"
          onClick={() => {
            document.location.href = `${HOME_URL}vagas/${id}`
          }}
        />
      </div>
    </div>
  )
}

JobCard.defaultProps = {
  data: {},
}

JobCard.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object,
}

export default JobCard
