import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  ChartBarIcon,
  CheckCircleIcon,
  TrendingUpIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

const Dashboard = () => {
  const [stats, setStats] = useState({
    companies: 0,
    contacts: 0,
    opportunities: 0,
    tasks: 0,
    totalOpportunityValue: 0,
    tasksCompleted: 0
  })
  const [loading, setLoading] = useState(true)

  const API_BASE_URL = 'http://localhost:5006/api'

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // API çağrıları paralel olarak yapılacak
      const [companiesRes, contactsRes, opportunitiesRes, tasksRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/companies`).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/contacts`).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/opportunities`).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/tasks`).catch(() => ({ data: [] }))
      ])

      const companies = companiesRes.data || []
      const contacts = contactsRes.data || []
      const opportunities = opportunitiesRes.data || []
      const tasks = tasksRes.data || []

      const totalOpportunityValue = opportunities.reduce((sum, opp) => sum + (opp.estimatedValue || 0), 0)
      const tasksCompleted = tasks.filter(task => task.status === 2).length // Completed status

      setStats({
        companies: companies.length,
        contacts: contacts.length,
        opportunities: opportunities.length,
        tasks: tasks.length,
        totalOpportunityValue,
        tasksCompleted
      })
    } catch (error) {
      console.error('Dashboard data fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(value)
  }

  const statCards = [
    {
      title: 'Toplam Şirket',
      value: stats.companies,
      icon: BuildingOfficeIcon,
      color: 'bg-blue-500',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'İletişim Kişileri',
      value: stats.contacts,
      icon: UserGroupIcon,
      color: 'bg-green-500',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Aktif Fırsatlar',
      value: stats.opportunities,
      icon: ChartBarIcon,
      color: 'bg-purple-500',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Toplam Görev',
      value: stats.tasks,
      icon: CheckCircleIcon,
      color: 'bg-orange-500',
      textColor: 'text-orange-600 dark:text-orange-400'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">CRM sisteminizin genel görünümü</p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {card.title}
                </h3>
                <p className={`text-2xl font-bold ${card.textColor}`}>
                  {card.value.toLocaleString('tr-TR')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detaylı İstatistikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fırsat Değeri */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Fırsat Analizi
            </h3>
            <TrendingUpIcon className="w-6 h-6 text-purple-600" />
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Toplam Fırsat Değeri</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(stats.totalOpportunityValue)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ortalama Fırsat Değeri</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {stats.opportunities > 0 
                  ? formatCurrency(stats.totalOpportunityValue / stats.opportunities)
                  : formatCurrency(0)
                }
              </p>
            </div>
          </div>
        </div>

        {/* Görev Durumu */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Görev Durumu
            </h3>
            <CalendarIcon className="w-6 h-6 text-orange-600" />
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tamamlanan Görevler</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.tasksCompleted}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Bekleyen Görevler</p>
              <p className="text-xl font-semibold text-orange-600 dark:text-orange-400">
                {stats.tasks - stats.tasksCompleted}
              </p>
            </div>
            {stats.tasks > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>Tamamlanma Oranı</span>
                  <span>{Math.round((stats.tasksCompleted / stats.tasks) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(stats.tasksCompleted / stats.tasks) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hızlı Aksiyonlar */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Hızlı İşlemler
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="btn-primary text-center">
            Yeni Şirket Ekle
          </button>
          <button className="btn-primary text-center">
            Yeni İletişim Ekle
          </button>
          <button className="btn-primary text-center">
            Yeni Fırsat Oluştur
          </button>
          <button className="btn-primary text-center">
            Yeni Görev Ata
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard