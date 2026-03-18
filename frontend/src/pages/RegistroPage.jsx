import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RegistroForm } from '../components/auth/RegistroForm'
import { ROUTES } from '../constants'
import { pacienteService } from '../services'
import { 
  noEstaVacio, 
  esEmailValido, 
  esIdentificacionValida, 
  esNombreValido,
  esPasswordValida 
} from '../utils/validators'
import '../styles/auth.css'

export function RegistroPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    cedula: '',
    nombre: '',
    email: '',
    password: '',
    confirmarPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpiar errores cuando el usuario escribe
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // Validar cédula
      if (!noEstaVacio(formData.cedula)) {
        throw new Error('La cédula es obligatoria')
      }
      if (!esIdentificacionValida(formData.cedula, 'cedula')) {
        throw new Error('La cédula ingresada no es válida. Debe tener entre 9 y 12 dígitos')
      }

      // Validar nombre
      if (!noEstaVacio(formData.nombre)) {
        throw new Error('El nombre completo es obligatorio')
      }
      if (!esNombreValido(formData.nombre)) {
        throw new Error('El nombre debe tener al menos 3 caracteres y solo contener letras')
      }

      // Validar email
      if (!noEstaVacio(formData.email)) {
        throw new Error('El correo electrónico es obligatorio')
      }
      if (!esEmailValido(formData.email)) {
        throw new Error('El correo electrónico ingresado no es válido')
      }

      // Validar contraseña
      const validacionPassword = esPasswordValida(formData.password)
      if (!validacionPassword.esValida) {
        throw new Error(validacionPassword.mensajes.join('. ') || 'La contraseña no cumple los requisitos')
      }

      // Validar confirmación de contraseña
      if (!noEstaVacio(formData.confirmarPassword)) {
        throw new Error('Debe confirmar la contraseña')
      }
      if (formData.password !== formData.confirmarPassword) {
        throw new Error('Las contraseñas no coinciden. Verifique que ambas sean idénticas')
      }

      await pacienteService.crear({
        cedula: formData.cedula,
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
        rolId: 1
      })

      setSuccess('Cuenta creada exitosamente. Redirigiendo...')
      setTimeout(() => {
        navigate(ROUTES.LOGIN)
      }, 2000)
    } catch (err) {
      // Mejorar manejo de errores específicos
      let mensajeError = err.message || 'Error al crear la cuenta'
      
      // Si es un error del servidor con mensaje técnico
      if (mensajeError && mensajeError.includes('could not execute')) {
        if (mensajeError.includes('UKcp50s437ucrqks12eh3ixy7al') || mensajeError.includes('identificacion')) {
          mensajeError = 'La cédula de identidad ya está registrada en el sistema. Intente con otra.'
        } else if (mensajeError.includes('email')) {
          mensajeError = 'El correo electrónico ya está registrado. Intente con otro.'
        } else {
          mensajeError = 'Los datos ingresados ya están registrados. Por favor, intente con otros datos.'
        }
      } else if (mensajeError && mensajeError.includes('Duplicate')) {
        mensajeError = 'Los datos ingresados ya están registrados. Por favor, intente con otros datos.'
      }
      
      setError(mensajeError)
      setLoading(false)
    }
  }

  return (
    <RegistroForm
      formData={formData}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      success={success}
    />
  )
}

