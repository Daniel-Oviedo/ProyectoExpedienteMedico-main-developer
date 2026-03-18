import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { servicioOlvideContrasena } from '../../services'
import { esPasswordValida, noEstaVacio } from '../../utils/validators'

export function FormularioOlvideContrasena() {
  const navigate = useNavigate()
  const [paso, setPaso] = useState(1) // Paso 1, 2 o 3
  const [email, setEmail] = useState('')
  const [codigo, setCodigo] = useState('')
  const [nuevaPassword, setNuevaPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Paso 1: Enviar email
  const manejarPaso1 = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const respuesta = await servicioOlvideContrasena.olvidarContrasena({ email })
      setMessage(respuesta.mensaje)
      setTimeout(() => {
        setMessage('')
        setPaso(2)
      }, 1500)
    } catch (err) {
      setError(err.message || 'Error enviando email')
    } finally {
      setLoading(false)
    }
  }

  // Paso 2: Verificar código
  const manejarPaso2 = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const respuesta = await servicioOlvideContrasena.verificarCodigo({ email, codigo })
      setMessage(respuesta.mensaje)
      setTimeout(() => {
        setMessage('')
        setPaso(3)
      }, 1500)
    } catch (err) {
      setError(err.message || 'Código inválido')
    } finally {
      setLoading(false)
    }
  }

  // Paso 3: Cambiar contraseña
  const passwordValidation = esPasswordValida(nuevaPassword)
  const passwordValida = passwordValidation.esValida
  const mostrarErrorPassword = noEstaVacio(nuevaPassword) && !passwordValida

  const confirmarPasswordValida = noEstaVacio(confirmarPassword) && 
                                   nuevaPassword === confirmarPassword &&
                                   passwordValida
  const mostrarErrorConfirmar = noEstaVacio(confirmarPassword) && 
                                 !confirmarPasswordValida

  const mensajeConfirmar = () => {
    if (!confirmarPassword) return ''
    if (nuevaPassword !== confirmarPassword) {
      return 'Las contraseñas no coinciden'
    }
    return ''
  }

  // El botón se habilita solo si ambas contraseñas son válidas y coinciden
  const formularioValido = passwordValida && confirmarPasswordValida

  const manejarPaso3 = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError('')
    setMessage('')

    try {
      const respuesta = await servicioOlvideContrasena.restablecerContrasena({
        email,
        codigo,
        nuevaPassword
      })
      setMessage(respuesta.mensaje)
      setTimeout(() => {
        setMessage('')
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(err.message || 'Error cambiando contraseña')
    } finally {
      setLoading(false)
    }
  }

  // Indicador de progreso
  const indicadorPaso = () => {
    return (
      <div className="paso-indicador">
        <div className={`paso-numero ${paso >= 1 ? 'activo' : ''}`}>1</div>
        <div className={`paso-linea ${paso >= 2 ? 'activo' : ''}`}></div>
        <div className={`paso-numero ${paso >= 2 ? 'activo' : ''}`}>2</div>
        <div className={`paso-linea ${paso >= 3 ? 'activo' : ''}`}></div>
        <div className={`paso-numero ${paso >= 3 ? 'activo' : ''}`}>3</div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Recuperar Contraseña</h1>
          <p>Paso {paso} de 3</p>
        </div>

        {indicadorPaso()}

        {error && <div className="alert alert-error">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        {/* PASO 1: Email */}
        {paso === 1 && (
          <form onSubmit={manejarPaso1}>
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                required
                disabled={loading}
              />
              <p className="info-text">Recibirás un código en este correo</p>
            </div>
            <button type="submit" disabled={loading} className="btn-auth">
              {loading ? 'Enviando...' : 'Siguiente'}
            </button>
          </form>
        )}

        {/* PASO 2: Código */}
        {paso === 2 && (
          <form onSubmit={manejarPaso2}>
            <div className="form-group">
              <label htmlFor="codigo">Código de Verificación</label>
              <input
                type="text"
                id="codigo"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength="6"
                required
                disabled={loading}
                autoComplete="off"
              />
              <p className="info-text">Ingresa el código que recibiste por email</p>
            </div>
            <div className="button-group">
              <button 
                type="button" 
                onClick={() => setPaso(1)} 
                className="btn-secondary"
                disabled={loading}
              >
                Atrás
              </button>
              <button type="submit" disabled={loading} className="btn-auth">
                {loading ? 'Verificando...' : 'Siguiente'}
              </button>
            </div>
          </form>
        )}

        {/* PASO 3: Nueva Contraseña */}
        {paso === 3 && (
          <form onSubmit={manejarPaso3}>
            <div className="form-group">
              <label htmlFor="nuevaPassword">Nueva Contraseña</label>
              <input
                type="password"
                id="nuevaPassword"
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
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
              {!mostrarErrorPassword && noEstaVacio(nuevaPassword) && (
                <span className="success-message">✓ Contraseña válida</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmarPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmarPassword"
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
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

            <div className="button-group">
              <button 
                type="button" 
                onClick={() => setPaso(2)} 
                className="btn-secondary"
                disabled={loading}
              >
                Atrás
              </button>
              <button 
                type="submit" 
                disabled={loading || !formularioValido} 
                className="btn-auth"
                title={!formularioValido ? 'Completa todos los campos correctamente' : ''}
              >
                {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
              </button>
            </div>
          </form>
        )}

        <div className="auth-footer">
          <p>
            ¿Recuerdas tu contraseña? <a href="/login">Inicia sesión aquí</a>
          </p>
        </div>
      </div>
    </div>
  )
}
