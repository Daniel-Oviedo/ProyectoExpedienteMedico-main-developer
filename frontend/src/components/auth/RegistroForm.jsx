import { Link } from 'react-router-dom'
import { 
  esIdentificacionValida,
  esNombreValido,
  esEmailValido,
  esPasswordValida,
  noEstaVacio
} from '../../utils/validators'

export function RegistroForm({ formData, onInputChange, onSubmit, loading, error, success }) {
  // Validaciones en tiempo real
  const cedulaSoloNumeros = formData.cedula.replace(/\D/g, '')
  const cedulaValida = cedulaSoloNumeros.length === 0 || esIdentificacionValida(formData.cedula, 'cedula')
  const mostrarErrorCedula = cedulaSoloNumeros.length > 0 && !cedulaValida

  const mensajeCedula = () => {
    if (!cedulaSoloNumeros.length) return ''
    if (cedulaSoloNumeros.length < 9) {
      return `Debe tener al menos 9 dígitos (${cedulaSoloNumeros.length}/9)`
    }
    if (cedulaSoloNumeros.length > 12) {
      return `No puede exceder 12 dígitos (${cedulaSoloNumeros.length}/12)`
    }
    return 'La cédula ingresada no es válida'
  }

  const nombreValido = noEstaVacio(formData.nombre) && esNombreValido(formData.nombre)
  const mostrarErrorNombre = noEstaVacio(formData.nombre) && !nombreValido

  const mensajeNombre = () => {
    if (!formData.nombre.trim()) return ''
    if (formData.nombre.trim().length < 3) {
      return 'El nombre debe tener al menos 3 caracteres'
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/.test(formData.nombre)) {
      return 'Solo se permiten letras, espacios y guiones'
    }
    return 'El nombre no es válido'
  }

  const emailValido = noEstaVacio(formData.email) && esEmailValido(formData.email)
  const mostrarErrorEmail = noEstaVacio(formData.email) && !emailValido

  const passwordValidation = esPasswordValida(formData.password)
  const passwordValida = passwordValidation.esValida
  const mostrarErrorPassword = noEstaVacio(formData.password) && !passwordValida

  const confirmarPasswordValida = noEstaVacio(formData.confirmarPassword) && 
                                   formData.password === formData.confirmarPassword &&
                                   passwordValida
  const mostrarErrorConfirmar = noEstaVacio(formData.confirmarPassword) && 
                                 !confirmarPasswordValida

  const mensajeConfirmar = () => {
    if (!formData.confirmarPassword) return ''
    if (formData.password !== formData.confirmarPassword) {
      return 'Las contraseñas no coinciden'
    }
    return ''
  }

  // El botón se habilita solo si todos los campos son válidos
  const formularioValido = 
    cedulaValida && 
    nombreValido && 
    emailValido && 
    passwordValida && 
    confirmarPasswordValida

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Crear cuenta</h1>
        </div>
        
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={onSubmit}>
          {/* CÉDULA */}
          <div className="form-group">
            <label htmlFor="cedula">Cédula de Identidad</label>
            <input
              type="text"
              id="cedula"
              name="cedula"
              value={formData.cedula}
              onChange={onInputChange}
              placeholder="1-0000-0000"
              disabled={loading}
              className={mostrarErrorCedula ? 'input-error' : ''}
              maxLength="14"
            />
            {mostrarErrorCedula && (
              <span className="error-message">{mensajeCedula()}</span>
            )}
            {cedulaValida && cedulaSoloNumeros.length > 0 && (
              <span className="success-message">✓ Cédula válida</span>
            )}
          </div>

          {/* NOMBRE */}
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={onInputChange}
              placeholder="Juan Pérez García"
              disabled={loading}
              className={mostrarErrorNombre ? 'input-error' : ''}
              maxLength="100"
            />
            {mostrarErrorNombre && (
              <span className="error-message">{mensajeNombre()}</span>
            )}
            {nombreValido && (
              <span className="success-message">✓ Nombre válido</span>
            )}
          </div>

          {/* EMAIL */}
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              placeholder="correo@ejemplo.com"
              disabled={loading}
              className={mostrarErrorEmail ? 'input-error' : ''}
            />
            {mostrarErrorEmail && (
              <span className="error-message">Por favor, ingrese un correo válido</span>
            )}
            {emailValido && (
              <span className="success-message">✓ Correo válido</span>
            )}
          </div>

          {/* CONTRASEÑA */}
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={onInputChange}
              placeholder="••••••••••"
              disabled={loading}
              className={mostrarErrorPassword ? 'input-error' : ''}
            />
            {mostrarErrorPassword && (
              <div className="error-list">
                {passwordValidation.mensajes.map((msg, idx) => (
                  <span key={idx} className="error-message">• {msg}</span>
                ))}
              </div>
            )}
            {!mostrarErrorPassword && noEstaVacio(formData.password) && (
              <span className="success-message">✓ Contraseña válida</span>
            )}
          </div>

          {/* CONFIRMAR CONTRASEÑA */}
          <div className="form-group">
            <label htmlFor="confirmarPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmarPassword"
              name="confirmarPassword"
              value={formData.confirmarPassword}
              onChange={onInputChange}
              placeholder="••••••••••"
              disabled={loading}
              className={mostrarErrorConfirmar ? 'input-error' : ''}
            />
            {mostrarErrorConfirmar && (
              <span className="error-message">{mensajeConfirmar()}</span>
            )}
            {confirmarPasswordValida && (
              <span className="success-message">✓ Contraseñas coinciden</span>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading || !formularioValido} 
            className="btn-auth"
            title={!formularioValido ? 'Complete todos los campos correctamente' : ''}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
