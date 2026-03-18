import api from './api'

const servicioOlvideContrasenaAPI = {
  olvidarContrasena: (datos) => api.post('/auth/forgot-password', datos),
  verificarCodigo: (datos) => api.post('/auth/verify-code', datos),
  restablecerContrasena: (datos) => api.post('/auth/reset-password', datos),
}

export const servicioOlvideContrasena = {
  olvidarContrasena: async (datos) => {
    try {
      const response = await servicioOlvideContrasenaAPI.olvidarContrasena(datos)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.mensaje || 'Error en recuperación de contraseña')
    }
  },

  verificarCodigo: async (datos) => {
    try {
      const response = await servicioOlvideContrasenaAPI.verificarCodigo(datos)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.mensaje || 'Error verificando código')
    }
  },

  restablecerContrasena: async (datos) => {
    try {
      const response = await servicioOlvideContrasenaAPI.restablecerContrasena(datos)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.mensaje || 'Error cambiando contraseña')
    }
  },
}
