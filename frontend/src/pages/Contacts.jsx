import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  MagnifyingGlassIcon,
  PlusIcon,
  UserGroupIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

const Contacts = () => {
  const [contacts, setContacts] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selectedContact, setSelectedContact] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    mobile: '',
    position: '',
    department: '',
    isPrimaryContact: false,
    companyId: ''
  })

  const API_BASE_URL = 'http://localhost:5006/api'

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [contactsRes, companiesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/contacts`).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/companies`).catch(() => ({ data: [] }))
      ])
      
      setContacts(contactsRes.data || [])
      setCompanies(companiesRes.data || [])
    } catch (error) {
      console.error('Data fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const submitData = {
        ...formData,
        companyId: formData.companyId ? parseInt(formData.companyId) : null
      }

      if (modalMode === 'create') {
        await axios.post(`${API_BASE_URL}/contacts`, submitData)
      } else if (modalMode === 'edit') {
        await axios.put(`${API_BASE_URL}/contacts/${selectedContact.id}`, {
          ...submitData,
          id: selectedContact.id
        })
      }
      await fetchData()
      closeModal()
    } catch (error) {
      console.error('Contact save error:', error)
    }
  }

  const handleDelete = async (contact) => {
    if (window.confirm(`${contact.firstName} ${contact.lastName} kişisini silmek istediğinizden emin misiniz?`)) {
      try {
        await axios.delete(`${API_BASE_URL}/contacts/${contact.id}`)
        await fetchData()
      } catch (error) {
        console.error('Contact delete error:', error)
      }
    }
  }

  const openModal = (mode, contact = null) => {
    setModalMode(mode)
    setSelectedContact(contact)
    
    if (contact) {
      setFormData({
        firstName: contact.firstName || '',
        lastName: contact.lastName || '',
        email: contact.email || '',
        phone: contact.phone || '',
        mobile: contact.mobile || '',
        position: contact.position || '',
        department: contact.department || '',
        isPrimaryContact: contact.isPrimaryContact || false,
        companyId: contact.companyId || ''
      })
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        mobile: '',
        position: '',
        department: '',
        isPrimaryContact: false,
        companyId: ''
      })
    }
    
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedContact(null)
    setModalMode('create')
  }

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId)
    return company ? company.name : '-'
  }

  const filteredContacts = contacts.filter(contact =>
    contact.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCompanyName(contact.companyId)?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">İletişim Kişileri</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Toplam {contacts.length} kişi kayıtlı
          </p>
        </div>
        <button
          onClick={() => openModal('create')}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Yeni Kişi</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Ad, soyad, e-posta, pozisyon veya şirket ile ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Contacts Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Kişi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Şirket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Pozisyon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  İletişim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                      {searchTerm ? 'Arama kriterlerine uygun kişi bulunamadı' : 'Henüz kişi kaydı yok'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {contact.firstName?.charAt(0)}{contact.lastName?.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {contact.firstName} {contact.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {contact.email || '-'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {getCompanyName(contact.companyId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {contact.position || '-'}
                      </div>
                      {contact.department && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {contact.department}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {contact.phone || '-'}
                      </div>
                      {contact.mobile && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {contact.mobile}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {contact.isPrimaryContact ? (
                        <div className="flex items-center text-yellow-600 dark:text-yellow-400">
                          <StarSolidIcon className="w-4 h-4 mr-1" />
                          <span className="text-sm">Ana Kişi</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">Standart</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => openModal('view', contact)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                        title="Görüntüle"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openModal('edit', contact)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"
                        title="Düzenle"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(contact)}
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
                  {modalMode === 'create' ? 'Yeni Kişi Ekle' : 
                   modalMode === 'edit' ? 'Kişi Düzenle' : 'Kişi Detayları'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ad *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      required
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Soyad *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      required
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    E-posta
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mobil
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Pozisyon
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Departman
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Şirket
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

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isPrimaryContact"
                    checked={formData.isPrimaryContact}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Ana kişi olarak işaretle
                  </label>
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

export default Contacts