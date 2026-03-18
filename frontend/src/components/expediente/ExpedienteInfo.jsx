import { formatearFecha } from '../../utils/formatters'

export function ExpedienteInfo({ expediente }) {
  return (
    <div className="expediente-card">
      <div className="expediente-info">
        <h2>Detalles del Expediente</h2>
        <div className="info-grid">
          <div className="info-item">
            <label>ID del Expediente:</label>
            <span>{expediente.id}</span>
          </div>
          <div className="info-item">
            <label>Estado:</label>
            <span className={`status status--${expediente.estado.toLowerCase()}`}>
              {expediente.estado}
            </span>
          </div>
          <div className="info-item">
            <label>Fecha de Creación:</label>
            <span>{formatearFecha(expediente.fechaCreacion)}</span>
          </div>
          <div className="info-item">
            <label>ID del Paciente:</label>
            <span>{expediente.pacienteId}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
