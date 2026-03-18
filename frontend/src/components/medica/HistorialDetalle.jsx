import { useState } from 'react';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import { HistorialConsulta } from './HistorialConsulta';
import { RegistroContenido } from './RegistroContenido';

export function HistorialDetalle({ paciente, registros, onBack }) {
  const [rangoFechas, setRangoFechas] = useState(null);

  // Definir ranges predefinidos con etiquetas en español
  const predefinedRanges = [
    {
      label: 'Hoy',
      value: () => {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const hoyFin = new Date(hoy);
        hoyFin.setHours(23, 59, 59, 999);
        return [hoy, hoyFin];
      }
    },
    {
      label: 'Ayer',
      value: () => {
        const ayer = new Date();
        ayer.setDate(ayer.getDate() - 1);
        ayer.setHours(0, 0, 0, 0);
        const ayerFin = new Date(ayer);
        ayerFin.setHours(23, 59, 59, 999);
        return [ayer, ayerFin];
      }
    },
    {
      label: 'Últimos 7 días',
      value: () => {
        const hace7 = new Date();
        hace7.setDate(hace7.getDate() - 6);
        hace7.setHours(0, 0, 0, 0);
        const hoy = new Date();
        hoy.setHours(23, 59, 59, 999);
        return [hace7, hoy];
      }
    },
    {
      label: 'Últimos 30 días',
      value: () => {
        const hace30 = new Date();
        hace30.setDate(hace30.getDate() - 29);
        hace30.setHours(0, 0, 0, 0);
        const hoy = new Date();
        hoy.setHours(23, 59, 59, 999);
        return [hace30, hoy];
      }
    },
    {
      label: 'Este mes',
      value: () => {
        const hoy = new Date();
        const primero = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        primero.setHours(0, 0, 0, 0);
        const fin = new Date(hoy);
        fin.setHours(23, 59, 59, 999);
        return [primero, fin];
      }
    },
    {
      label: 'Mes pasado',
      value: () => {
        const hoy = new Date();
        const inicioMesPasado = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
        inicioMesPasado.setHours(0, 0, 0, 0);
        const finMesPasado = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
        finMesPasado.setHours(23, 59, 59, 999);
        return [inicioMesPasado, finMesPasado];
      }
    },
    {
      label: 'Este año',
      value: () => {
        const hoy = new Date();
        const primero = new Date(hoy.getFullYear(), 0, 1);
        primero.setHours(0, 0, 0, 0);
        const fin = new Date(hoy);
        fin.setHours(23, 59, 59, 999);
        return [primero, fin];
      }
    }
  ];

  // Filtrar registros por fecha
  const registrosFiltrados = registros.filter(registro => {
    if (!rangoFechas || rangoFechas.length !== 2) return true;

    const fechaRegistro = new Date(registro.fechaRegistro);
    const [inicio, fin] = rangoFechas;
    
    return fechaRegistro >= inicio && fechaRegistro <= fin;
  });

  const registrosPorFecha = registrosFiltrados.reduce((acc, registro) => {
    const fechaObj = new Date(registro.fechaRegistro);
    const fechaKey = fechaObj.toISOString().split('T')[0];
    if (!acc[fechaKey]) acc[fechaKey] = { fecha: fechaObj, registros: [] };
    acc[fechaKey].registros.push(registro);
    return acc;
  }, {});

  const fechasOrdenadas = Object.keys(registrosPorFecha).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  if (registros.length === 0) {
    return (
      <div className="historial-vacio">
        <p>No hay registros médicos para este paciente</p>
        <button className="btn-back" onClick={onBack}>← Atrás</button>
      </div>
    );
  }

  return (
    <div className="historial-detalle">
      <div className="historial-header">
        <div className="historial-paciente-info">
          <h2>{paciente.nombre}</h2>
          <p>Cédula: {paciente.identificacion}</p>
        </div>

        <div className="filtro-fechas-rsuite">
          <h3>Filtrar por fecha</h3>
          <DateRangePicker
            ranges={predefinedRanges}
            value={rangoFechas}
            onChange={setRangoFechas}
            placeholder="Seleccionar rango de fechas"
            format="dd/MM/yyyy"
            cleanable
            style={{ width: '100%' }}
            showHeader={true}
          />
        </div>
      </div>

      {fechasOrdenadas.length === 0 ? (
        <div className="no-resultados">
          <p>No hay registros en el rango de fechas seleccionado</p>
        </div>
      ) : (
        <div className="consultas-grid">
          {fechasOrdenadas.map((fechaKey, idx) => {
            const fechaObj = registrosPorFecha[fechaKey].fecha;
            return (
              <div key={idx} className="consulta-card">
                <div className="fecha-header">
                  <h4>{fechaObj.toLocaleDateString('es-ES', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}</h4>
                  <span className="num-registros">{registrosPorFecha[fechaKey].registros.length} consulta{registrosPorFecha[fechaKey].registros.length > 1 ? 's' : ''}</span>
                </div>

                <div className="consulta-contenido">
                  {registrosPorFecha[fechaKey].registros.map((registro, regIdx) => (
                    <RegistroContenido
                      key={regIdx}
                      registro={registro}
                      idx={regIdx}
                      registros={registrosPorFecha[fechaKey].registros}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button className="btn-back" onClick={onBack}>← Atrás</button>
    </div>
  );
}
