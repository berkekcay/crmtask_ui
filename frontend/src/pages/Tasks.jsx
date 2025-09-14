import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  MagnifyingGlassIcon,
  PlusIcon,
  CheckCircleIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ClockIcon,
  ExclamationCircleIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [companies, setCompanies] = useState([])
  const [contacts, setContacts] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selectedTask, setSelectedTask] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 0,
    priority: 1,
    assignedUserId: '',
    companyId: '',
    contactId: '',
    opportunityId: ''
  })

  const API_BASE_URL = 'http://localhost:5006/api'

  // Enum değerleri backend'den geliyor
  const statusOptions = [
    { value: 0, label: 'Bekliyor', color: 'bg-yellow-500', icon: ClockIcon },
    { value: 1, label: 'Devam Ediyor', color: 'bg-blue-500', icon: ExclamationCircleIcon },
    { value: 2, label: 'Tamamlandı', color: 'bg-green-500', icon: CheckIcon }
  ]

  const priorityOptions = [
    { value: 0, label: 'Düşük', color: 'text-green-600' },
    { value: 1, label: 'Orta', color: 'text-yellow-600' },
    { value: 2, label: 'Yüksek', color: 'text-red-600' }
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [tasksRes, companiesRes, contactsRes, usersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/tasks`).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/companies`).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/contacts`).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/users`).catch(() => ({ data: [] }))
      ])
      
      setTasks(tasksRes.data || [])
      setCompanies(companiesRes.data || [])
      setContacts(contactsRes.data || [])
      setUsers(usersRes.data || [])
    } catch (error) {
      console.error('Data fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const submitData = {
        ...formData,
        status: parseInt(formData.status),
        priority: parseInt(formData.priority),
        assignedUserId: parseInt(formData.assignedUserId),
        companyId: formData.companyId ? parseInt(formData.companyId) : null,
        contactId: formData.contactId ? parseInt(formData.contactId) : null,
        opportunityId: formData.opportunityId ? parseInt(formData.opportunityId) : null
      }

      if (modalMode === 'create') {
        await axios.post(`${API_BASE_URL}/tasks`, submitData)
      } else if (modalMode === 'edit') {
        await axios.put(`${API_BASE_URL}/tasks/${selectedTask.id}`, {
          ...submitData,
          id: selectedTask.id
        })
      }
      await fetchData()
      closeModal()
    } catch (error) {
      console.error('Task save error:', error)
    }
  }

  const handleDelete = async (task) => {
    if (window.confirm(`${task.title} görevini silmek istediğinizden emin misiniz?`)) {
      try {
        await axios.delete(`${API_BASE_URL}/tasks/${task.id}`)
        await fetchData()
      } catch (error) {
        console.error('Task delete error:', error)
      }
    }
  }

  const handleCompleteTask = async (task) => {
    try {
      await axios.post(`${API_BASE_URL}/tasks/${task.id}/complete`)
      await fetchData()
    } catch (error) {
      console.error('Task complete error:', error)
    }
  }

  const openModal = (mode, task = null) => {
    setModalMode(mode)
    setSelectedTask(task)
    
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        status: task.status || 0,
        priority: task.priority || 1,
        assignedUserId: task.assignedUserId || '',
        companyId: task.companyId || '',
        contactId: task.contactId || '',
        opportunityId: task.opportunityId || ''
      })
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        status: 0,
        priority: 1,
        assignedUserId: '',
        companyId: '',
        contactId: '',
        opportunityId: ''
      })
    }
    
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedTask(null)
    setModalMode('create')
  }

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId)
    return company ? company.name : null
  }

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.id === contactId)
    return contact ? `${contact.firstName} ${contact.lastName}` : null
  }

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId)
    return user ? `${user.firstName} ${user.lastName}` : '-'
  }

  const getStatusInfo = (status) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0]
  }

  const getPriorityInfo = (priority) => {
    return priorityOptions.find(p => p.value === priority) || priorityOptions[1]
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return format(new Date(dateString), 'dd MMM yyyy', { locale: tr })
  }

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === 2) return false
    return new Date(dueDate) < new Date()
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getUserName(task.assignedUserId)?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || task.status === parseInt(statusFilter)
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Görevler</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Toplam {tasks.length} görev kayıtlı
          </p>
        </div>
        <button
          onClick={() => openModal('create')}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Yeni Görev</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statusOptions.map(status => (
          <div key={status.value} className="card p-4">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${status.color}`}>
                <status.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">{status.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {tasks.filter(task => task.status === status.value).length}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-red-500">
              <ExclamationCircleIcon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Geciken</p>
              <p className="text-2xl font-bold text-red-600">
                {tasks.filter(task => isOverdue(task.dueDate, task.status)).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Görev başlığı, açıklama veya sorumlu ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field w-full sm:w-auto"
        >
          <option value="all">Tüm Durumlar</option>
          {statusOptions.map(status => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tasks Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Görev
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Sorumlu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  İlişkili
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Öncelik
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Termin
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center">
                    <CheckCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                      {searchTerm || statusFilter !== 'all' ? 'Arama kriterlerine uygun görev bulunamadı' : 'Henüz görev kaydı yok'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const statusInfo = getStatusInfo(task.status)
                  const priorityInfo = getPriorityInfo(task.priority)
                  const overdue = isOverdue(task.dueDate, task.status)

                  return (
                    <tr key={task.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${overdue ? 'bg-red-50 dark:bg-red-900/10' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {task.title}
                            {overdue && (
                              <ExclamationCircleIcon className="inline-block w-4 h-4 text-red-500 ml-2" />
                            )}
                          </div>
                          {task.description && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              {task.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {getUserName(task.assignedUserId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {getCompanyName(task.companyId) || '-'}
                        </div>
                        {getContactName(task.contactId) && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {getContactName(task.contactId)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${statusInfo.color}`}>
                          <statusInfo.icon className="w-3 h-3 mr-1" />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${priorityInfo.color}`}>
                          {priorityInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <span className={overdue ? 'text-red-600 font-medium' : ''}>
                          {formatDate(task.dueDate)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        {task.status !== 2 && (
                          <button
                            onClick={() => handleCompleteTask(task)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400"
                            title="Tamamla"
                          >
                            <CheckIcon className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => openModal('view', task)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                          title="Görüntüle"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openModal('edit', task)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"
                          title="Düzenle"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(task)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400"
                          title="Sil"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {modalMode === 'create' ? 'Yeni Görev Ekle' : 
                   modalMode === 'edit' ? 'Görev Düzenle' : 'Görev Detayları'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Görev Başlığı *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Açıklama
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    rows={3}
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Termin Tarihi
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Sorumlu Kullanıcı *
                    </label>
                    <select
                      name="assignedUserId"
                      value={formData.assignedUserId}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      required
                      className="input-field"
                    >
                      <option value="">Kullanıcı seçin</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.firstName} {user.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Durum
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      className="input-field"
                    >
                      {statusOptions.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Öncelik
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      className="input-field"
                    >
                      {priorityOptions.map(priority => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      İlişkili Şirket
                    </label>
                    <select
                      name="companyId"
                      value={formData.companyId}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      className="input-field"
                    >
                      <option value="">Şirket seçin</option>
                      {companies.map(company => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      İlişkili Kişi
                    </label>
                    <select
                      name="contactId"
                      value={formData.contactId}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      className="input-field"
                    >
                      <option value="">Kişi seçin</option>
                      {contacts.map(contact => (
                        <option key={contact.id} value={contact.id}>
                          {contact.firstName} {contact.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {modalMode !== 'view' && (
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="btn-secondary"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      {modalMode === 'create' ? 'Oluştur' : 'Güncelle'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Tasks