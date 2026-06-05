import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSearch,
  faUserEdit,
  faTrashAlt,
  faChevronLeft,
  faChevronRight,
  faUser,
  faEnvelope,
  faUserTag,
  faFilter,
} from '@fortawesome/free-solid-svg-icons'
import Text from '../../../components/Text'
import TextInput from '../../../components/TextInput'
import ConfirmModal from '../../../components/Modals/ConfirmModal'
import { useGetUsers, useAdminRoutes } from '../../../hooks/admin'
import { SelectBox } from '../../../components/FormElements'

function ManageUsers() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const { users, count, refresh } = useGetUsers()
  const { updateUser, deleteUser } = useAdminRoutes()

  // Modal States
  const [deleteModal, setDeleteModal] = useState({ opened: false, user: null })
  const [editModal, setEditModal] = useState({ opened: false, user: null })

  // Form States for Edit
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    role: '',
    isActive: true,
  })

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' ? user.isActive : !user.isActive)

    return matchesSearch && matchesRole && matchesStatus
  })

  const handleEditClick = (user) => {
    setEditData({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    })
    setEditModal({ opened: true, user })
  }

  const handleDeleteClick = (user) => {
    setDeleteModal({ opened: true, user })
  }

  const onConfirmDelete = async () => {
    if (await deleteUser(deleteModal.user.id)) {
      refresh()
      setDeleteModal({ opened: false, user: null })
    }
  }

  const onConfirmEdit = async () => {
    if (await updateUser(editModal.user.id, editData)) {
      refresh()
      setEditModal({ opened: false, user: null })
    }
  }

  return (
    <div className="manage-users">
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        title="Excluir Usuário"
        description={`Deseja realmente excluir o usuário ${deleteModal.user?.name}? Esta ação não pode ser desfeita.`}
        opened={deleteModal.opened}
        onConfirm={onConfirmDelete}
        onCancel={() => setDeleteModal({ opened: false, user: null })}
        isDangerous
      />

      {/* Edit User Modal */}
      <div className={`modal ${editModal.opened ? 'is-active' : ''}`}>
        <div
          className="modal-background"
          onClick={() => setEditModal({ opened: false, user: null })}
        />
        <div className="modal-card" style={{ width: '600px', maxWidth: '95%' }}>
          <header className="modal-card-head bg-blue">
            <p className="modal-card-title has-text-white">Editar Usuário</p>
            <button
              type="button"
              className="delete"
              aria-label="close"
              onClick={() => setEditModal({ opened: false, user: null })}
            />
          </header>
          <section className="modal-card-body p-5">
            {editModal.user && (
              <>
                <div className="is-flex is-align-items-center mb-5">
                  <figure className="image is-64x64 mr-4">
                    <img
                      className="is-rounded shadow-sm"
                      src={
                        editModal.user.avatar ||
                        `https://ui-avatars.com/api/?name=${editModal.user.name}&background=random&size=128`
                      }
                      alt={editModal.user.name}
                    />
                  </figure>
                  <div>
                    <Text
                      text={editData.name}
                      size={22}
                      className="is-bold text-blue-strong"
                    />
                    <Text
                      text={editData.email}
                      size={14}
                      className="has-text-grey"
                    />
                  </div>
                </div>

                <div className="columns is-multiline">
                  <div className="column is-12">
                    <TextInput
                      label="Nome Completo"
                      icon={faUser}
                      value={editData.name}
                      setValue={(val) =>
                        setEditData({ ...editData, name: val })
                      }
                    />
                  </div>
                  <div className="column is-12">
                    <TextInput
                      label="E-mail"
                      icon={faEnvelope}
                      value={editData.email}
                      setValue={(val) =>
                        setEditData({ ...editData, email: val })
                      }
                    />
                  </div>
                  <div className="column is-6">
                    <SelectBox
                      label="Cargo / Permissão"
                      icon={faUserTag}
                      value={editData.role}
                      onChange={(e) =>
                        setEditData({ ...editData, role: e.target.value })
                      }
                      options={[
                        { id: 1, value: 'COMMON', label: 'Candidato' },
                        { id: 2, value: 'ADMIN', label: 'Administrador' },
                      ]}
                    />
                  </div>
                  <div className="column is-6">
                    <SelectBox
                      label="Status da Conta"
                      value={editData.isActive ? 'true' : 'false'}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          isActive: e.target.value === 'true',
                        })
                      }
                      options={[
                        { id: 1, value: 'true', label: 'Ativo' },
                        { id: 2, value: 'false', label: 'Inativo' },
                      ]}
                    />
                  </div>
                </div>
              </>
            )}
          </section>
          <footer className="modal-card-foot is-justify-content-flex-end">
            <button
              type="button"
              className="button is-success"
              onClick={onConfirmEdit}
            >
              Salvar Alterações
            </button>
            <button
              type="button"
              className="button"
              onClick={() => setEditModal({ opened: false, user: null })}
            >
              Cancelar
            </button>
          </footer>
        </div>
      </div>

      <div className="mb-4">
        <Text
          text="Gerenciar Usuários"
          size={32}
          className="is-bold-700 text-blue-strong mb-1"
        />
        <Text
          text="Visualize, edite e gerencie as permissões de todos os usuários cadastrados no sistema."
          className="has-text-grey"
          size={14}
        />
      </div>

      {/* Filters Bar */}
      <div className="is-flex is-justify-content-space-between is-align-items-flex-end mb-5 p-4 has-background-white border-radius-12 shadow-sm">
        <div className="is-flex is-align-items-center" style={{ gap: '20px' }}>
          <div style={{ width: '300px' }}>
            <TextInput
              className="dashboard-search"
              placeholder="Pesquisar por nome ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={faSearch}
            />
          </div>

          <div style={{ width: '180px' }}>
            <SelectBox
              label="Filtrar por Cargo"
              initialOption=""
              icon={faFilter}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              options={[
                { id: 0, value: 'ALL', label: 'Todos os cargos' },
                { id: 1, value: 'COMMON', label: 'Candidatos' },
                { id: 2, value: 'ADMIN', label: 'Administradores' },
              ]}
            />
          </div>

          <div style={{ width: '180px' }}>
            <SelectBox
              label="Filtrar por Status"
              initialOption=""
              icon={faFilter}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { id: 0, value: 'ALL', label: 'Todos os status' },
                { id: 1, value: 'ACTIVE', label: 'Ativos' },
                { id: 2, value: 'INACTIVE', label: 'Inativos' },
              ]}
            />
          </div>
        </div>

        <div className="pb-1">
          <Text
            text={`${filteredUsers.length} usuários encontrados`}
            size={13}
            className="has-text-grey"
          />
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Usuário</th>
            <th>E-mail</th>
            <th>Empresa</th>
            <th>Cargo</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>
                <div className="is-flex is-align-items-center">
                  <figure className="image is-32x32 mr-3">
                    <img
                      className="is-rounded"
                      src={
                        user.avatar ||
                        `https://ui-avatars.com/api/?name=${user.name}&background=random`
                      }
                      alt={user.name}
                    />
                  </figure>
                  <Text text={user.name} className="is-bold" />
                </div>
              </td>
              <td>
                <Text text={user.email} />
              </td>
              <td>
                <Text text={user.company?.name || 'Não vinculado'} />
              </td>
              <td>
                <Text
                  text={user.role === 'ADMIN' ? 'Administrador' : 'Candidato'}
                />
              </td>
              <td>
                <span
                  className={`status-badge ${
                    user.isActive ? 'status-active' : 'status-inactive'
                  }`}
                >
                  {user.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td>
                <div className="buttons are-small">
                  <button
                    type="button"
                    className="button is-white has-text-info"
                    title="Editar"
                    onClick={() => handleEditClick(user)}
                  >
                    <FontAwesomeIcon icon={faUserEdit} />
                  </button>
                  <button
                    type="button"
                    className="button is-white has-text-danger"
                    title="Excluir"
                    onClick={() => handleDeleteClick(user)}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredUsers.length === 0 && (
        <div className="has-text-centered py-6">
          <Text
            text="Nenhum usuário encontrado com os filtros aplicados."
            className="has-text-grey"
          />
        </div>
      )}

      {/* Pagination */}
      <div className="pagination-container mt-6">
        <div className="is-flex is-align-items-center has-text-grey">
          <Text
            text={`Mostrando ${filteredUsers.length} de ${count} usuários`}
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
    </div>
  )
}

export default ManageUsers
