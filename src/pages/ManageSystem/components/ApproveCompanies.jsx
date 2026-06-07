import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheck,
  faTimes,
  faBuilding,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import Text from '../../../components/Text'
import { useGetCompanyRequests, useAdminRoutes } from '../../../hooks/admin'

function ApproveCompanies() {
  const { requests, refresh } = useGetCompanyRequests()
  const { approveCompany, rejectCompany } = useAdminRoutes()

  const handleApprove = async (id) => {
    if (await approveCompany(id)) refresh()
  }

  const handleReject = async (id) => {
    if (await rejectCompany(id)) refresh()
  }

  return (
    <div className="approve-companies">
      <div className="mb-4">
        <Text
          text="Aprovação de Empresas"
          size={32}
          className="is-bold-700 text-blue-strong mb-1"
        />
        <Text
          text="Revise e gerencie as solicitações de novas empresas interessadas em publicar vagas."
          className="has-text-grey"
          size={14}
        />
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Empresa</th>
            <th>CNPJ</th>
            <th>Usuário Solicitante</th>
            <th>Data</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td>
                <div className="is-flex is-align-items-center">
                  <div className="has-background-light p-2 border-radius-8 mr-3">
                    <FontAwesomeIcon
                      icon={faBuilding}
                      className="has-text-grey"
                    />
                  </div>
                  <Text
                    text={req.company?.name || 'Empresa'}
                    className="is-bold"
                  />
                </div>
              </td>
              <td>
                <Text text={req.company?.cnpj || '-'} />
              </td>
              <td>
                <div>
                  <Text text={req.user?.name} size={14} className="is-bold" />
                  <Text
                    text={req.user?.email}
                    size={12}
                    className="has-text-grey"
                  />
                </div>
              </td>
              <td>
                <Text text={req.createdAt?.split('T')[0] || '-'} />
              </td>
              <td>
                <div className="buttons are-small">
                  <button
                    type="button"
                    className="button is-success is-light"
                    title="Aprovar"
                    onClick={() => handleApprove(req.id)}
                  >
                    <FontAwesomeIcon icon={faCheck} className="mr-1" /> Aprovar
                  </button>
                  <button
                    type="button"
                    className="button is-danger is-light"
                    title="Rejeitar"
                    onClick={() => handleReject(req.id)}
                  >
                    <FontAwesomeIcon icon={faTimes} className="mr-1" /> Rejeitar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {requests.length === 0 && (
        <div className="has-text-centered py-6">
          <Text
            text="Nenhuma solicitação pendente no momento."
            className="has-text-grey"
          />
        </div>
      )}

      {/* Pagination */}
      {requests.length > 0 && (
        <div className="pagination-container mt-6">
          <div className="is-flex is-align-items-center has-text-grey">
            <Text
              text={`Mostrando ${requests.length} solicitações`}
              size={14}
            />
          </div>
          <div className="pagination-buttons">
            <button type="button" className="pagination-btn disabled">
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button type="button" className="pagination-btn active">
              1
            </button>
            <button type="button" className="pagination-btn disabled">
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ApproveCompanies
