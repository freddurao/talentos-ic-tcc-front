import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import './style.css'
import LinesEllipsis from 'react-lines-ellipsis'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faThumbsUp,
  faThumbsDown,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons'
import { Button } from '../FormElements'
import { localDate } from '../../utils/conversions'
import { HOME_URL } from '../../api'
import { useJobRoutes, getFeedbackStatus } from '../../hooks/jobs'

function JobRecommendationCard({ data }) {
  const { title, description, site, endingDate, id, companyId } = data
  const { feedbackJobs } = useJobRoutes()
  const likeFeedback = () => {
    feedbackJobs(id, 'like')
    window.location.reload()
  }
  const dislikeFeedback = () => {
    feedbackJobs(id, 'dislike')
    window.location.reload()
  }
  const removeFeedback = () => {
    window.location.reload()
    feedbackJobs(id, 'neutro')
  }

  const [feedbackStatus, setFeedbackStatus] = useState('')
  const status = getFeedbackStatus(id)
  useEffect(() => {
    setFeedbackStatus(status)
  }, [status])

  const renderNeutro = () => {
    return (
      <>
        <button type="button" className="like-button" onClick={likeFeedback}>
          <FontAwesomeIcon icon={faThumbsUp} size="lg" />
        </button>
        <button
          type="button"
          className="dislike-button"
          onClick={dislikeFeedback}
        >
          <FontAwesomeIcon icon={faThumbsDown} size="lg" />
        </button>
      </>
    )
  }
  const renderLike = () => {
    return (
      <>
        <button
          type="button"
          className="like-button-pressed"
          onClick={removeFeedback}
        >
          <FontAwesomeIcon icon={faThumbsUp} size="lg" />
        </button>
        <button
          type="button"
          className="dislike-button"
          onClick={dislikeFeedback}
        >
          <FontAwesomeIcon icon={faThumbsDown} size="lg" />
        </button>
      </>
    )
  }

  const renderDislike = () => {
    return (
      <>
        <button type="button" className="like-button" onClick={likeFeedback}>
          <FontAwesomeIcon icon={faThumbsUp} size="lg" />
        </button>
        <button
          type="button"
          className="dislike-button-pressed"
          onClick={removeFeedback}
        >
          <FontAwesomeIcon icon={faThumbsDown} size="lg" />
        </button>
      </>
    )
  }

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
      <div
        style={{
          display: 'flex',
          marginBottom: '10px',
          marginTop: '10px',
          marginLeft: 'auto',
          height: '50px',
        }}
      >
        {/* eslint-disable */}
        {console.log('Esse e o feedbackstatus', feedbackStatus)}
        {feedbackStatus === 'neutro'
          ? renderNeutro()
          : feedbackStatus === 'dislike'
          ? renderDislike()
          : renderLike()}
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

JobRecommendationCard.defaultProps = {
  data: {},
}

JobRecommendationCard.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object,
}

export default JobRecommendationCard
