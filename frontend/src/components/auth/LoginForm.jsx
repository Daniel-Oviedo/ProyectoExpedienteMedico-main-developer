import { Link } from 'react-router-dom'

export function LoginForm({ email, onEmailChange, password, onPasswordChange, onSubmit, loading, error }) {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Inicia sesión</h1>
        </div>
        
        <form onSubmit={onSubmit}>
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="email" className="field-label">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              required
              placeholder="tu@email.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="field-label">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              required
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-auth">
            {loading ? 'Iniciando...' : 'Iniciar sesión'}
          </button>

          <div className="forgot-password-link">
            <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
          </div>
        </form>

        <div className="auth-footer">
          <p>
            ¿No tienes cuenta? <Link to="/registro">Crea una cuenta</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
