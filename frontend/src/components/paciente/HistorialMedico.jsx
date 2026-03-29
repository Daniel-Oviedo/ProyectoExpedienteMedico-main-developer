import { useState } from 'react'
import { DateRangePicker } from 'rsuite'
import 'rsuite/dist/rsuite.min.css'
import { formatearFecha } from '../../utils/formatters'
import { RegistroDetalle } from './RegistroDetalle'

export function HistorialMedico({ registros }) {
  const [rangoFechas, setRangoFechas] = useState(null)
  const [consultaSeleccionada, setConsultaSeleccionada] = useState(null)

  // Definir ranges predefinidos con etiquetas en español
  const predefinedRanges = [
    {
      label: 'Hoy',
      value: () => {
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)
        const hoyFin = new Date(hoy)
        hoyFin.setHours(23, 59, 59, 999)
        return [hoy, hoyFin]
      }
    },
    {
      label: 'Ayer',
      value: () => {
        const ayer = new Date()
        ayer.setDate(ayer.getDate() - 1)
        ayer.setHours(0, 0, 0, 0)
        const ayerFin = new Date(ayer)
        ayerFin.setHours(23, 59, 59, 999)
        return [ayer, ayerFin]
      }
    },
    {
      label: 'Últimos 7 días',
      value: () => {
        const hace7 = new Date()
        hace7.setDate(hace7.getDate() - 6)
        hace7.setHours(0, 0, 0, 0)
        const hoy = new Date()
        hoy.setHours(23, 59, 59, 999)
        return [hace7, hoy]
      }
    },
    {
      label: 'Últimos 30 días',
      value: () => {
        const hace30 = new Date()
        hace30.setDate(hace30.getDate() - 29)
        hace30.setHours(0, 0, 0, 0)
        const hoy = new Date()
        hoy.setHours(23, 59, 59, 999)
        return [hace30, hoy]
      }
    },
    {
      label: 'Este mes',
      value: () => {
        const hoy = new Date()
        const primero = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
        primero.setHours(0, 0, 0, 0)
        const fin = new Date(hoy)
        fin.setHours(23, 59, 59, 999)
        return [primero, fin]
      }
    },
    {
      label: 'Mes pasado',
      value: () => {
        const hoy = new Date()
        const inicioMesPasado = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1)
        inicioMesPasado.setHours(0, 0, 0, 0)
        const finMesPasado = new Date(hoy.getFullYear(), hoy.getMonth(), 0)
        finMesPasado.setHours(23, 59, 59, 999)
        return [inicioMesPasado, finMesPasado]
      }
    },
    {
      label: 'Este año',
      value: () => {
        const hoy = new Date()
        const primero = new Date(hoy.getFullYear(), 0, 1)
        primero.setHours(0, 0, 0, 0)
        const fin = new Date(hoy)
        fin.setHours(23, 59, 59, 999)
        return [primero, fin]
      }
    }
  ]

  // Filtrar registros por fecha
  const registrosFiltrados = registros.filter(registro => {
    if (!rangoFechas || rangoFechas.length !== 2) return true

    const fechaRegistro = new Date(registro.fechaRegistro)
    const [inicio, fin] = rangoFechas
    
    return fechaRegistro >= inicio && fechaRegistro <= fin
  })

  const agruparRegistrosPorConsulta = (regs) => {
    const agrupados = {}
    
    regs.forEach(registro => {
      const fecha = registro.fechaRegistro 
        ? formatearFecha(registro.fechaRegistro)
        : 'Sin fecha'
      
      if (!agrupados[fecha]) {
        agrupados[fecha] = {
          registros: [],
          fechaReal: registro.fechaRegistro
        }
      }
      agrupados[fecha].registros.push(registro)
    })

    return Object.entries(agrupados)
      .sort((a, b) => new Date(b[1].fechaReal) - new Date(a[1].fechaReal))
      .map(([fecha, data], idx) => ({
        id: idx,
        numero: idx + 1,
        fecha,
        registros: data.registros
      }))
  }

  const consultasAgrupadas = agruparRegistrosPorConsulta(registrosFiltrados)

  // Si hay una consulta seleccionada, mostrar detalle
  if (consultaSeleccionada !== null) {
    const consulta = consultasAgrupadas[consultaSeleccionada]
    if (!consulta) return null

    // Obtener el motivo de la consulta del primer registro
    const motivo = consulta.registros.find(r => r.observaciones)?.observaciones 
      || consulta.registros.find(r => r.diagnostico)?.diagnostico 
      || 'Sin motivo especificado'

    return (
      <div className="registros-section">
        <div className="detalle-header-paciente">
          <button 
            className="btn-back-detalle"
            onClick={() => setConsultaSeleccionada(null)}
          >
            ← Atrás
          </button>
          <h2>Detalle de la Consulta</h2>
        </div>

        <div className="consulta-detalle">
          <div className="consulta-detalle__header">
            <div className="consulta-info__item">
              <span className="consulta-info__label">{motivo}</span>
              <span className="consulta-info__value">{consulta.fecha}</span>
            </div>
          </div>

          <div className="consulta-detalle__content">
            {consulta.registros.map((registro) => (
              <RegistroDetalle key={registro.id} registro={registro} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Vista de lista de consultas
  return (
    <div className="registros-section">
      <div className="historial-header-paciente">
        <h2>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-chart-dots"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 3v18h18" /><path d="M7 9a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 7a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M12 15a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M10.16 10.62l2.34 2.88" /><path d="M15.088 13.328l2.837 -4.586" /></svg>
          Historial Médico
        </h2>

        <div className="filtro-historial-paciente">
          <label>Filtrar por fecha:</label>
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
      
      {registros.length === 0 ? (
        <div className="no-records">
          <p>No hay registros médicos aún.</p>
        </div>
      ) : registrosFiltrados.length === 0 ? (
        <div className="no-records">
          <p>No hay registros en el rango de fechas seleccionado.</p>
        </div>
      ) : (
        <div className="consultas-list">
          {consultasAgrupadas.map((consulta) => {
            // Obtener el motivo de la consulta del primer registro
            const motivo = consulta.registros.find(r => r.observaciones)?.observaciones 
              || consulta.registros.find(r => r.diagnostico)?.diagnostico 
              || 'Sin motivo especificado'
            
            return (
              <button
                key={consulta.id}
                className="consulta-list-item"
                onClick={() => setConsultaSeleccionada(consulta.id)}
              >
                <div className="consulta-list-item__header">
                  <h3 className="consulta-list-item__numero">{motivo}</h3>
                  <span className="consulta-list-item__fecha">{consulta.fecha}</span>
                </div>
                <div className="consulta-list-item__arrow">›</div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
