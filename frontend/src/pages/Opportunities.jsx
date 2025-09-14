import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  MagnifyingGlassIcon,
  PlusIcon,
  ChartBarIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([])
  const [companies, setCompanies] = useState([])
  const [contacts, setContacts] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selectedOpportunity, setSelectedOpportunity] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    estimatedValue: '',
    probability: '',
    expectedCloseDate: '',
    stageId: 1,
    companyId: '',
    contactId: '',
    assignedUserId: ''
  })

  const API_BASE_URL = 'http://localhost:5006/api'

  // Mock stages - normalde API'den gelecek
  const stages = [
    { id: 1, name: 'Yeni Fırsat', color: 'bg-blue-500' },
    { id: 2, name: 'Nitelikli', color: 'bg-yellow-500' },
    { id: 3, name: 'Teklif', color: 'bg-orange-500' },
    { id: 4, name: 'Müzakere', color: 'bg-purple-500' },
    { id: 5, name: 'Kazanıldı', color: 'bg-green-500' },
    { id: 6, name: 'Kaybedildi', color: 'bg-red-500' }
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [opportunitiesRes, companiesRes, contactsRes, usersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/opportunities`).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/companies`).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/contacts`).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/users`).catch(() => ({ data: [] }))
      ])
      
      setOpportunities(opportunitiesRes.data || [])
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
        estimatedValue: parseFloat(formData.estimatedValue) || 0,
        probability: parseInt(formData.probability) || 0,
        stageId: parseInt(formData.stageId),
        companyId: parseInt(formData.companyId),
        contactId: formData.contactId ? parseInt(formData.contactId) : null,
        assignedUserId: parseInt(formData.assignedUserId)
      }

      if (modalMode === 'create') {
        await axios.post(`${API_BASE_URL}/opportunities`, submitData)
      } else if (modalMode === 'edit') {
        await axios.put(`${API_BASE_URL}/opportunities/${selectedOpportunity.id}`, {
          ...submitData,
          id: selectedOpportunity.id
        })
      }
      await fetchData()
      closeModal()
    } catch (error) {
      console.error('Opportunity save error:', error)
    }
  }

  const handleDelete = async (opportunity) => {
    if (window.confirm(`${opportunity.name} fırsatını silmek istediğinizden emin misiniz?`)) {
      try {
        await axios.delete(`${API_BASE_URL}/opportunities/${opportunity.id}`)
        await fetchData()
      } catch (error) {
        console.error('Opportunity delete error:', error)
      }
    }
  }

  const openModal = (mode, opportunity = null) => {
    setModalMode(mode)
    setSelectedOpportunity(opportunity)
    
    if (opportunity) {
      setFormData({
        name: opportunity.name || '',
        description: opportunity.description || '',
        estimatedValue: opportunity.estimatedValue || '',
        probability: opportunity.probability || '',
        expectedCloseDate: opportunity.expectedCloseDate ? opportunity.expectedCloseDate.split('T')[0] : '',
        stageId: opportunity.stageId || 1,
        companyId: opportunity.companyId || '',
        contactId: opportunity.contactId || '',
        assignedUserId: opportunity.assignedUserId || ''
      })
    } else {
      setFormData({
        name: '',
        description: '',
        estimatedValue: '',
        probability: '',
        expectedCloseDate: '',
        stageId: 1,
        companyId: '',
        contactId: '',
        assignedUserId: ''
      })
    }
    
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedOpportunity(null)
    setModalMode('create')
  }

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId)
    return company ? company.name : '-'
  }

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.id === contactId)
    return contact ? `${contact.firstName} ${contact.lastName}` : '-'
  }

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId)
    return user ? `${user.firstName} ${user.lastName}` : '-'
  }

  const getStageName = (stageId) => {
    const stage = stages.find(s => s.id === stageId)
    return stage ? stage.name : 'Bilinmeyen'
  }

  const getStageColor = (stageId) => {
    const stage = stages.find(s => s.id === stageId)
    return stage ? stage.color : 'bg-gray-500'
  }

  const formatCurrency = (value) => {
    if (!value) return '-'
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(value)
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return format(new Date(dateString), 'dd MMM yyyy', { locale: tr })
  }

  const filteredOpportunities = opportunities.filter(opportunity =>
    opportunity.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCompanyName(opportunity.companyId)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getStageName(opportunity.stageId)?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fırsatlar</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Toplam {opportunities.length} fırsat kayıtlı
          </p>
        </div>
        <button
          onClick={() => openModal('create')}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Yeni Fırsat</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center">
            <CurrencyDollarIcon className="w-8 h-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Toplam Değer</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatCurrency(opportunities.reduce((sum, opp) => sum + (opp.estimatedValue || 0), 0))}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <ChartBarIcon className="w-8 h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Ortalama Değer</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {opportunities.length > 0 
                  ? formatCurrency(opportunities.reduce((sum, opp) => sum + (opp.estimatedValue || 0), 0) / opportunities.length)
                  : formatCurrency(0)
                }
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">K</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Kazanılan</p>
              <p className="text-lg font-semibold text-green-600">
                {opportunities.filter(opp => opp.stageId === 5).length}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Aktif</p>
              <p className="text-lg font-semibold text-orange-600">
                {opportunities.filter(opp => opp.stageId < 5).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Fırsat adı, şirket veya aşama ile ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Opportunities Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Fırsat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Şirket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Değer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Aşama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Olasılık
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Kapanış Tarihi
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOpportunities.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center">
                    <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                      {searchTerm ? 'Arama kriterlerine uygun fırsat bulunamadı' : 'Henüz fırsat kaydı yok'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredOpportunities.map((opportunity) => (
                  <tr key={opportunity.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {opportunity.name}
                        </div>
                        {opportunity.description && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {opportunity.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {getCompanyName(opportunity.companyId)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {getContactName(opportunity.contactId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(opportunity.estimatedValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStageColor(opportunity.stageId)}`}>
                        {getStageName(opportunity.stageId)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${opportunity.probability || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {opportunity.probability || 0}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDate(opportunity.expectedCloseDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => openModal('view', opportunity)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                        title="Görüntüle"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openModal('edit', opportunity)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"
                        title="Düzenle"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(opportunity)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400"
                        title="Sil"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
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
                  {modalMode === 'create' ? 'Yeni Fırsat Ekle' : 
                   modalMode === 'edit' ? 'Fırsat Düzenle' : 'Fırsat Detayları'}
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
                    Fırsat Adı *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
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
                      Tahmini Değer (₺)
                    </label>
                    <input
                      type="number"
                      name="estimatedValue"
                      value={formData.estimatedValue}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Başarı Olasılığı (%)
                    </label>
                    <input
                      type="number"
                      name="probability"
                      value={formData.probability}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      min="0"
                      max="100"
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Beklenen Kapanış Tarihi
                  </label>
                  <input
                    type="date"
                    name="expectedCloseDate"
                    value={formData.expectedCloseDate}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Aşama
                  </label>
                  <select
                    name="stageId"
                    value={formData.stageId}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    className="input-field"
                  >
                    {stages.map(stage => (
                      <option key={stage.id} value={stage.id}>
                        {stage.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Şirket *
                  </label>
                  <select
                    name="companyId"
                    value={formData.companyId}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    required
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
                    İletişim Kişisi
                  </label>
                  <select
                    name="contactId"
                    value={formData.contactId}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    className="input-field"
                  >
                    <option value="">İletişim kişisi seçin</option>
                    {contacts.map(contact => (
                      <option key={contact.id} value={contact.id}>
                        {contact.firstName} {contact.lastName}
                      </option>
                    ))}
                  </select>
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

export default Opportunities