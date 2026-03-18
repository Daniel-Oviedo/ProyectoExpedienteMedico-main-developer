export function MenuNavigation({ user, onNavigate }) {
  return (
    <div className="menu-section">
      <h2 className="menu-section__title">Opciones</h2>
      
      {user?.rol === 'ROLE_PACIENTE' && (
        <div className="menu-grid">
          <button 
            onClick={() => onNavigate('/paciente')}
            className="menu-card-item"
          >
            <div className="menu-card-item__icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-clipboard-text" style={{ margin: 'auto', display: 'block' }}><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17.997 4.17a3 3 0 0 1 2.003 2.83v12a3 3 0 0 1 -3 3h-10a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 2.003 -2.83a4 4 0 0 0 3.997 3.83h4a4 4 0 0 0 3.98 -3.597zm-2.997 10.83h-6a1 1 0 0 0 0 2h6a1 1 0 0 0 0 -2m0 -4h-6a1 1 0 0 0 0 2h6a1 1 0 0 0 0 -2m-1 -9a2 2 0 1 1 0 4h-4a2 2 0 1 1 0 -4z" /></svg>
            </div>
            <div className="menu-card-item__content">
              <span className="menu-card-item__title">Mi Expediente</span>
              <span className="menu-card-item__subtitle">Ver tus registros médicos</span>
            </div>
            <div className="menu-card-item__arrow">›</div>
          </button>
        </div>
      )}

      {user?.rol === 'ROLE_ENFERMERA' && (
        <div className="menu-grid">
          <button 
            onClick={() => onNavigate('/enfermera')}
            className="menu-card-item"
          >
            <div className="menu-card-item__icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 12h4l3 8l4 -16l3 8h4" />
              </svg>
            </div>
            <div className="menu-card-item__content">
              <span className="menu-card-item__title">Registrar Paciente</span>
              <span className="menu-card-item__subtitle">Agregar nuevos pacientes</span>
            </div>
            <div className="menu-card-item__arrow">›</div>
          </button>
        </div>
      )}

      {user?.rol === 'ROLE_MEDICA' && (
        <div className="menu-grid">
          <button 
            onClick={() => onNavigate('/medica')}
            className="menu-card-item"
          >
            <div className="menu-card-item__icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ margin: 'auto', display: 'block', flexShrink: 0 }}>
                <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
                <path d="M10 14l4 0" />
                <path d="M12 12l0 4" />
              </svg>
            </div>
            <div className="menu-card-item__content">
              <span className="menu-card-item__title">Registrar Diagnóstico</span>
              <span className="menu-card-item__subtitle">Crear diagnóstico y medicamentos</span>
            </div>
            <div className="menu-card-item__arrow">›</div>
          </button>
        </div>
      )}
    </div>
  )
}
