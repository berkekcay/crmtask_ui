import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  const API_BASE_URL = 'http://localhost:5006/api'

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // Bu kısımda normalde user bilgilerini almak için API çağrısı yapılır
      // Şimdilik token varsa user'ı mock olarak set ediyoruz
      setUser({ id: 1, email: 'user@example.com', firstName: 'Kullanıcı', lastName: 'Adı' })
    }
    setLoading(false)
  }, [token])

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      })
      
      const { token: authToken } = response.data
      setToken(authToken)
      localStorage.setItem('token', authToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
      
      // Token ile user bilgilerini al (normalde ayrı bir API çağrısı)
      setUser({ id: 1, email, firstName: 'Kullanıcı', lastName: 'Adı' })
      
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Giriş yapılırken bir hata oluştu' 
      }
    }
  }

  const register = async (firstName, lastName, email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        firstName,
        lastName,
        email,
        password
      })
      
      return { success: true }
    } catch (error) {
      console.error('Register error:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Kayıt olurken bir hata oluştu' 
      }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}