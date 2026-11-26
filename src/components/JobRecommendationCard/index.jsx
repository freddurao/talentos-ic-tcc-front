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

  // Valores do backend: 'none' (sem voto), 'like' ou 'dislike'
  const [feedbackStatus, setFeedbackStatus] = useState('')
  const status = getFeedbackStatus(id)
  useEffect(() => {
    setFeedbackStatus(status)
  }, [status])

  // Atualiza o botão na hora e desfaz se o servidor recusar (sem recarregar a página)
  const changeFeedback = async (newStatus) => {
    const previousStatus = feedbackStatus
    setFeedbackStatus(newStatus)
    const saved = await feedbackJobs(id, newStatus)
    if (!saved) setFeedbackStatus(previousStatus)
  }
  const likeFeedback = () => changeFeedback('like')
  const dislikeFeedback = () => changeFeedback('dislike')
  const removeFeedback = () => changeFeedback('none')

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
        {feedbackStatus === 'like' && renderLike()}
        {feedbackStatus === 'dislike' && renderDislike()}
        {feedbackStatus !== 'like' &&
          feedbackStatus !== 'dislike' &&
          renderNeutro()}
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
