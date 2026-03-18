import { formatearFecha } from '../../utils/formatters'

export function HistorialConsulta({ fecha, registros, onBack }) {
  const handleBack = (e) => {
    e.preventDefault();
    onBack();
  };

  return (
    <div className="historial-consulta">
      <div className="historial-header">
        <button className="btn-back" onClick={handleBack}>← Atrás</button>
        <h3>📅 {formatearFecha(fecha)}</h3>
      </div>

      <div className="consultas-contenedor">
        {registros.map((registro, idx) => {
          const RegistroContenido = require('./RegistroContenido').RegistroContenido;
          return (
            <RegistroContenido
              key={idx}
              registro={registro}
              idx={idx}
              registros={registros}
            />
          );
        })}
      </div>
    </div>
  );
}
