import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080'

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    
    // Mejorar mensajes de error del servidor
    if (error.response?.data) {
      // Si el servidor devuelve un mensaje técnico SQL, intentar mejorarlo
      const mensajeOriginal = error.response?.data?.message || ''
      if (mensajeOriginal.includes('could not execute') || mensajeOriginal.includes('Duplicate')) {
        // Dejar que el servicio específico maneje la traducción
        // pero asegurarse de que el mensaje esté disponible
        if (!error.response.data.message) {
          error.response.data.message = mensajeOriginal
        }
      }
    }
    
    return Promise.reject(error)
  }
)

// ============ AUTH ENDPOINTS ============
export const apiAutenticacion = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
}

// ============ USUARIOS ENDPOINTS ============
export const usuariosAPI = {
  obtenerPerfil: () =>
    api.get('/api/usuarios/perfil'),
}

// ============ PACIENTES ENDPOINTS ============
export const pacientesAPI = {
  crear: (datos) =>
    api.post('/auth/registro', datos),
  
  listar: () =>
    api.get('/api/pacientes'),
  
  buscarPorCedula: (cedula) =>
    api.get('/api/pacientes/buscar', { params: { cedula } }),
  
  listarSinDiagnostico: () =>
    api.get('/api/pacientes/sin-diagnostico'),
  
  registrarConVitales: (datos) =>
    api.post('/api/pacientes/registrar-con-vitales', datos),
}

// ============ EXPEDIENTES ENDPOINTS ============
export const expedientesAPI = {
  listar: () =>
    api.get('/api/expedientes'),
  
  obtenerPorId: (id) =>
    api.get(`/api/expedientes/${id}`),
  
  obtenerMio: () =>
    api.get('/api/expedientes/mio'),
  
  obtenerPorPaciente: (pacienteId) =>
    api.get(`/api/expedientes/paciente/${pacienteId}`),
  
  crear: (pacienteId) =>
    api.post('/api/expedientes', { pacienteId }),
}

// ============ REGISTROS MÉDICOS ENDPOINTS ============
export const registrosMedicosAPI = {
  listarPorExpediente: (expedienteId) =>
    api.get(`/api/registros-medicos/expediente/${expedienteId}`),
  
  crear: (datos) =>
    api.post('/api/registros-medicos', datos),
  
  registrarDiagnostico: (datos) =>
    api.post('/api/registros-medicos/diagnostico', datos),
  
  actualizar: (registroId, datos) =>
    api.put(`/api/registros-medicos/${registroId}`, datos),
}

export default api
