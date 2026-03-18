/**
 * Funciones de Validación
 * Utilidades para validar datos
 */

/**
 * Valida si se proporciona un valor no vacío
 * @param {string} valor - Valor a validar
 * @returns {boolean} true si no está vacío
 */
export const noEstaVacio = (valor) => {
  if (typeof valor !== 'string') return false
  return valor.trim().length > 0
}

/**
 * Valida si un nombre es válido
 * @param {string} nombre - Nombre a validar
 * @returns {boolean} true si es válido
 */
export const esNombreValido = (nombre) => {
  if (!noEstaVacio(nombre)) return false
  // Solo letras, espacios y algunos caracteres comunes
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/
  return regex.test(nombre) && nombre.trim().length >= 3 && nombre.trim().length <= 100
}

/**
 * Valida si un email es correcto
 * @param {string} email - Email a validar
 * @returns {boolean} true si es válido
 */
export const esEmailValido = (email) => {
  if (!noEstaVacio(email)) return false
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Valida si una contraseña cumple requisitos mínimos
 * @param {string} password - Contraseña a validar
 * @returns {Object} { esValida, mensajes }
 */
export const esPasswordValida = (password) => {
  const mensajes = []

  if (!noEstaVacio(password)) {
    return {
      esValida: false,
      mensajes: ['La contraseña es obligatoria']
    }
  }

  if (password.length < 8) {
    mensajes.push('La contraseña debe tener al menos 8 caracteres')
  }

  if (!/[A-Z]/.test(password)) {
    mensajes.push('Debe incluir al menos una letra mayúscula')
  }

  if (!/[a-z]/.test(password)) {
    mensajes.push('Debe incluir al menos una letra minúscula')
  }

  if (!/[0-9]/.test(password)) {
    mensajes.push('Debe incluir al menos un número')
  }

  return {
    esValida: mensajes.length === 0,
    mensajes
  }
}

/**
 * Valida si una contraseña es fuerte
 * @param {string} password - Contraseña a validar
 * @returns {Object} { esValida, fuerza, mensajes }
 */
export const esPasswordFuerte = (password) => {
  if (!password || password.length < 6) {
    return {
      esValida: false,
      fuerza: 'muy-debil',
      mensajes: ['Mínimo 6 caracteres']
    }
  }

  const validaciones = {
    mayuscula: /[A-Z]/.test(password),
    minuscula: /[a-z]/.test(password),
    numero: /[0-9]/.test(password),
    caracter: /[!@#$%^&*]/.test(password)
  }

  const puntos = Object.values(validaciones).filter(Boolean).length
  const fuerza = puntos <= 1 ? 'debil' : puntos <= 2 ? 'media' : 'fuerte'

  const mensajes = []
  if (!validaciones.mayuscula) mensajes.push('Agrega una mayúscula')
  if (!validaciones.numero) mensajes.push('Agrega un número')
  if (!validaciones.caracter) mensajes.push('Agrega un carácter especial')

  return {
    esValida: puntos >= 3,
    fuerza,
    mensajes
  }
}

/**
 * Valida si es mayor de edad
 * @param {string|Date} fechaNacimiento - Fecha de nacimiento
 * @param {number} edad - Edad mínima (default: 18)
 * @returns {boolean} true si es mayor
 */
export const esMayorDeEdad = (fechaNacimiento, edad = 18) => {
  const fechaNac = new Date(fechaNacimiento)
  const hoy = new Date()
  const diferencia = hoy.getFullYear() - fechaNac.getFullYear()
  const hayCumpleaños = hoy.getMonth() >= fechaNac.getMonth() &&
    hoy.getDate() >= fechaNac.getDate()
  const edadActual = hayCumpleaños ? diferencia : diferencia - 1

  return edadActual >= edad
}

/**
 * Valida un número de identificación de Costa Rica
 * Las cédulas costarricenses pueden tener 9, 10, 11 o 12 dígitos
 * @param {string} numero - Número de identificación
 * @param {string} tipo - Tipo de documento (cedula, pasaporte, etc)
 * @returns {boolean} true si es válido
 */
export const esIdentificacionValida = (numero, tipo = 'cedula') => {
  if (!numero) return false

  const soloNumeros = numero.replace(/\D/g, '')

  if (tipo === 'cedula') {
    // Las cédulas de Costa Rica pueden tener entre 9 y 12 dígitos
    if (soloNumeros.length < 9 || soloNumeros.length > 12) {
      return false
    }

    // Para cédulas de 10 dígitos, validar dígito verificador (módulo 7)
    if (soloNumeros.length === 10) {
      const digitos = soloNumeros.substring(0, 9).split('')
      const pesos = [3, 2, 7, 6, 5, 4, 3, 2]
      let suma = 0

      for (let i = 0; i < 8; i++) {
        const digito = parseInt(digitos[i], 10)
        let resultado = digito * pesos[i]
        
        if (resultado >= 10) {
          resultado = resultado - 10
        }
        
        suma += resultado
      }

      const digitoVerificador = parseInt(soloNumeros.substring(9, 10), 10)
      let moduloResultado = suma % 10
      moduloResultado = moduloResultado === 0 ? 0 : 10 - moduloResultado

      return moduloResultado === digitoVerificador
    }

    // Para otras longitudes (9, 11, 12), aceptar directamente
    return true
  }

  return soloNumeros.length > 0
}

/**
 * Valida teléfono
 * @param {string} telefono - Teléfono a validar
 * @returns {boolean} true si es válido
 */
export const esTelefonoValido = (telefono) => {
  const soloNumeros = telefono.replace(/\D/g, '')
  return soloNumeros.length >= 10
}

/**
 * Valida URL
 * @param {string} url - URL a validar
 * @returns {boolean} true si es válida
 */
export const esUrlValida = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Valida si es un número
 * @param {any} valor - Valor a validar
 * @returns {boolean} true si es número
 */
export const esNumero = (valor) => {
  return !isNaN(parseFloat(valor)) && isFinite(valor)
}

/**
 * Valida rango de números
 * @param {number} valor - Valor a validar
 * @param {number} min - Mínimo
 * @param {number} max - Máximo
 * @returns {boolean} true si está en rango
 */
export const esRangoValido = (valor, min, max) => {
  return esNumero(valor) && valor >= min && valor <= max
}

/**
 * Valida fecha futura
 * @param {string|Date} fecha - Fecha a validar
 * @returns {boolean} true si es futura
 */
export const esFechaFutura = (fecha) => {
  return new Date(fecha) > new Date()
}

/**
 * Valida fecha pasada
 * @param {string|Date} fecha - Fecha a validar
 * @returns {boolean} true si es pasada
 */
export const esFechaPasada = (fecha) => {
  return new Date(fecha) < new Date()
}

/**
 * Valida longitud de texto
 * @param {string} texto - Texto a validar
 * @param {number} min - Mínimo
 * @param {number} max - Máximo
 * @returns {boolean} true si está dentro del rango
 */
export const esLongitudValida = (texto, min = 0, max = 255) => {
  if (!texto) return min === 0
  return texto.length >= min && texto.length <= max
}

/**
 * Valida presión arterial
 * @param {string} presion - Presión (ej: 120/80)
 * @returns {boolean} true si es válida
 */
export const esPresionValida = (presion) => {
  if (!presion) return false
  const [sistolica, diastolica] = presion.split('/').map(Number)
  return esRangoValido(sistolica, 60, 200) && esRangoValido(diastolica, 40, 120)
}

/**
 * Valida peso (en kg)
 * @param {number} peso - Peso en kg
 * @returns {boolean} true si es válido
 */
export const esPesoValido = (peso) => {
  return esRangoValido(peso, 1, 500)
}

/**
 * Valida altura (en cm)
 * @param {number} altura - Altura en cm
 * @returns {boolean} true si es válida
 */
export const esAlturaValida = (altura) => {
  return esRangoValido(altura, 30, 300)
}
