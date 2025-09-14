import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  MagnifyingGlassIcon,
  PlusIcon,
  BuildingOfficeIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

const Companies = () => {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('create') // create, edit, view
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    annualRevenue: '',
    employeeCount: ''
  })

  const API_BASE_URL = 'http://localhost:5006/api'

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/companies`)
      setCompanies(response.data || [])
    } catch (error) {
      console.error('Companies fetch error:', error)
      setCompanies([])
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
      if (modalMode === 'create') {
        await axios.post(`${API_BASE_URL}/companies`, formData)
      } else if (modalMode === 'edit') {
        await axios.put(`${API_BASE_URL}/companies/${selectedCompany.id}`, {
          ...formData,
          id: selectedCompany.id
        })
      }
      await fetchCompanies()
      closeModal()
    } catch (error) {
      console.error('Company save error:', error)
    }
  }

  const handleDelete = async (company) => {
    if (window.confirm(`${company.name} şirketini silmek istediğinizden emin misiniz?`)) {
      try {
        await axios.delete(`${API_BASE_URL}/companies/${company.id}`)
        await fetchCompanies()
      } catch (error) {
        console.error('Company delete error:', error)
      }
    }
  }

  const openModal = (mode, company = null) => {
    setModalMode(mode)
    setSelectedCompany(company)
    
    if (company) {
      setFormData({
        name: company.name || '',
        description: company.description || '',
        industry: company.industry || '',
        phone: company.phone || '',
        email: company.email || '',
        website: company.website || '',
        address: company.address || '',
        city: company.city || '',
        country: company.country || '',
        postalCode: company.postalCode || '',
        annualRevenue: company.annualRevenue || '',
        employeeCount: company.employeeCount || ''
      })
    } else {
      setFormData({
        name: '',
        description: '',
        industry: '',
        phone: '',
        email: '',
        website: '',
        address: '',
        city: '',
        country: '',
        postalCode: '',
        annualRevenue: '',
        employeeCount: ''
      })
    }
    
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedCompany(null)
    setModalMode('create')
  }

  const filteredCompanies = companies.filter(company =>
    company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.city?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCurrency = (value) => {
    if (!value) return '-'
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(value)
  }

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Şirketler</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Toplam {companies.length} şirket kayıtlı
          </p>
        </div>
        <button
          onClick={() => openModal('create')}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Yeni Şirket</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Şirket adı, sektör veya şehir ile ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Companies Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Şirket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Sektör
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  İletişim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Lokasyon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Yıllık Ciro
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                      {searchTerm ? 'Arama kriterlerine uygun şirket bulunamadı' : 'Henüz şirket kaydı yok'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {company.name}
                        </div>
                        {company.description && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {company.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {company.industry || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {company.email || '-'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {company.phone || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {company.city && company.country ? `${company.city}, ${company.country}` : (company.city || company.country || '-')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatCurrency(company.annualRevenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => openModal('view', company)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                        title="Görüntüle"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openModal('edit', company)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"
                        title="Düzenle"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(company)}
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
                  {modalMode === 'create' ? 'Yeni Şirket Ekle' : 
                   modalMode === 'edit' ? 'Şirket Düzenle' : 'Şirket Detayları'}
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
                      Şirket Adı *
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
                      Sektör
                    </label>
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      className="input-field"
                    />
                  </div>
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Adres
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Şehir
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ülke
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Posta Kodu
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Yıllık Ciro (₺)
                    </label>
                    <input
                      type="number"
                      name="annualRevenue"
                      value={formData.annualRevenue}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Çalışan Sayısı
                    </label>
                    <input
                      type="number"
                      name="employeeCount"
                      value={formData.employeeCount}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      className="input-field"
                    />
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

export default Companies