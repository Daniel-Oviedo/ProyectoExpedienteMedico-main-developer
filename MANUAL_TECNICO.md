# MANUAL TÉCNICO
## SISTEMA DE GESTIÓN DE EXPEDIENTE MÉDICO

**Versión:** 1.0  
**Fecha:** Marzo 2026  
**Aplicación:** ProyectoExpedienteMedico  
**Audiencia:** Desarrolladores

---

## TABLA DE CONTENIDOS

1. [Introducción](#introducción)
2. [Diagramas](#diagramas)
3. [Requisitos del Sistema](#requisitos-del-sistema)
4. [Instalación Detallada](#instalación-detallada)
5. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
6. [Flujos del Sistema](#flujos-del-sistema)
7. [Base de Datos](#base-de-datos)
8. [API Endpoints](#api-endpoints)
9. [Troubleshooting](#troubleshooting)

---

## INTRODUCCIÓN

Este manual está diseñado para que cualquier desarrollador pueda **clonar, configurar y ejecutar** el proyecto en su máquina local.

### Stack Tecnológico:

| Layer | Tecnología | Versión |
|-------|-----------|---------|
| **Backend** | Spring Boot | 3.5.9 |
| **Java** | JDK | 21 |
| **Autenticación** | JWT + Spring Security | RFC 7519 |
| **Base de Datos** | MySQL | 8.0+ |
| **Frontend** | React + Vite | 19.2.1 / 7.2.4 |
| **UI Components** | rsuite | 6.1.2 |
| **HTTP Client** | Axios | 1.13.2 |

---

## DIAGRAMAS

Esta sección contiene los diagramas visuales del sistema:

### Diagrama de Casos de Uso
[IMAGEN 1: casos-de-uso.png]

**Descripción:** Muestra los 3 roles principales (Enfermera, Médica, Paciente) y qué acciones puede hacer cada uno.

---

### Diagrama de Arquitectura
[IMAGEN 2: arquitectura.png]

**Descripción:** Estructura de capas - Backend, Frontend, Base de Datos y cómo se comunican.

---

### Diagrama Entidad-Relación (BD)
[IMAGEN 3: entidad-relacion.png]

**Descripción:** Las 6 tablas principales y sus relaciones.

---

### Nota sobre Diagramas de Flujo
Los diagramas de secuencia detallados (Enfermera, Médica, Paciente) se encuentran en la sección **[Flujos del Sistema](#flujos-del-sistema)** más adelante.

---

**Antes de empezar, instala las siguientes herramientas:**

| Requisito | Versión | Verificar | Descargar |
|-----------|---------|-----------|----------|
| **Git** | Latest | `git --version` | https://git-scm.com/download/ |
| **Java JDK** | 21+ | `java -version` | https://www.oracle.com/java/technologies/downloads/#java21 |
| **MySQL** | 8.0+ | `mysql -u root -p` | https://dev.mysql.com/downloads/mysql/ |
| **Node.js** | 18+ | `node --version` | https://nodejs.org/ |

**⚠️ IMPORTANTE:** Todos estos debe estar instalados y en el PATH antes de continuar.

Verifi cada una ejecutando en terminal:
```bash
git --version
java -version
mysql --version
node --version
npm --version
```

---

## INSTALACIÓN DETALLADA

### Paso 1: Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd ProyectoExpedienteMedico-main-developer
```

**[SCREENSHOT 1: 01-git-clone.png - Terminal mostrando git clone exitoso]**

### Paso 2: Verificar Java 21

```bash
java -version
```

Debe mostrar: `java version "21.x.x"`

### Paso 3: Configurar MySQL

Abre terminal y conecta a MySQL:
```bash
mysql -u root -p
```

Ingresa contraseña y verifica que conecta. Luego crea la BD:
```sql
CREATE DATABASE expediente_medico CHARACTER SET utf8mb4;
EXIT;
```

Luego edita `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3307/expediente_medico?useSSL=false
spring.datasource.username=root
spring.datasource.password=daniel18  # Cambia si lo necesitas
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
server.port=8080
```

### Paso 4: Instalar dependencias Backend

```bash
mvnw.cmd clean install
```

Maven descargará todas las dependencias del `pom.xml`. Esto toma 3-5 minutos la primera vez.

### Paso 5: Instalar dependencias Frontend

```bash
cd frontend
npm install
```

Descarga todas las librerías de `package.json` (2-3 minutos).

### Paso 6: Ejecutar el proyecto

**Terminal 1 - Backend:**
```bash
mvnw.cmd spring-boot:run
```
Espera a ver: `Started ExpedientemedicoApplication in X seconds`

**[SCREENSHOT 2: 02-backend-running.png - Terminal: 'Started ExpedientemedicoApplication']**

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Espera a ver: `Local: http://localhost:5174`

**[SCREENSHOT 3: 03-frontend-running.png - Terminal: 'Local: http://localhost:5174']**

**Abre navegador en http://localhost:5174**

**[SCREENSHOT 4: 04-browser-login.png - Navegador: Pantalla de login]**

---

## ARQUITECTURA DEL PROYECTO

### Estructura General

```
ProyectoExpedienteMedico/
├── backend/
│   ├── src/main/java/com/manager/expedientemedico/
│   │   ├── controller/        # Endpoints REST
│   │   ├── service/           # Lógica de negocio
│   │   ├── model/             # Entidades (BD)
│   │   ├── repository/        # Acceso a BD
│   │   ├── config/            # Configuración
│   │   ├── security/          # JWT, CORS, etc
│   │   └── dto/               # Modelos de datos
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── pages/             # Páginas React
│   │   ├── components/        # Componentes
│   │   ├── services/          # Llamadas API
│   │   ├── context/           # Global State
│   │   ├── hooks/             # Custom Hooks
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
└── init_usuarios.sql
```

### Componentes clave:

- **Controllers:** Definen endpoints (GET, POST, PUT, DELETE) con validación de roles
- **Services:** Contienen la lógica de negocio y validaciones
- **Repositories:** Manejan la comunicación JPA con la BD
- **DTOs:** Modelos para transferencia de datos (no exponer entidades directamente)
- **Security:** Autenticación JWT + Spring Security + Validación de roles (@PreAuthorize)
- **Utils:** SecurityUtils para obtener usuario/rol autenticado

### Validación de datos por rol:

El backend valida automáticamente:
- **ENFERMERA**: Puede registrar solo vitales (presión, peso, altura, temperatura, saturación)
- **MEDICA**: Puede registrar solo diagnóstico, medicamentos, plan seguimiento, historia clínica
- **PACIENTE**: Solo lectura de su expediente y registros

### Flujo de datos:

```
Usuario (React) 
    ↓
Frontend (http://localhost:5174)
    ↓
API REST (http://localhost:8080/api)
    ↓
Backend (Spring Boot)
    ↓
MySQL Database
```

---

## FLUJOS DEL SISTEMA

Esta sección describe los flujos principales de interacción de cada rol con el sistema.

---

### Flujo 1: Enfermera - Búsqueda y Registro de Vitales

La Enfermera busca un paciente por su número de cédula. Si el Usuario no existe en el sistema, el sistema retorna ERROR 404 y finaliza el flujo sin permitir continuar. Si el Usuario existe, la Enfermera procede a registrar sus signos vitales (presión, peso, altura, temperatura, saturación de oxígeno). El sistema crea automáticamente un Paciente si no existe vinculado a ese Usuario, y un Expediente con estado PENDIENTE si no existe vinculado a ese Paciente. Al finalizar, el Expediente queda en estado PENDIENTE, aguardando que la Médica agregue el diagnóstico.

[IMAGEN 8: secuencia-enfermera-detallada.png - Diagrama de secuencia completo]

**APIs usadas:** `GET /api/pacientes/buscar?cedula=XXX`, `POST /api/pacientes/registrar-con-vitales`

**Pasos del flujo:**
1. Enfermera inicia sesión en el sistema (Backend genera JWT)
2. Navega a "Buscar Paciente" e ingresa cédula
3. Sistema ejecuta: `GET /api/pacientes/buscar?cedula=XXX`
4. Si Usuario **NO existe**:
   - Sistema retorna ERROR 404: "Usuario no encontrado"
   - Flujo finaliza
5. Si Usuario **SÍ existe**:
   - Sistema retorna datos del usuario
6. Enfermera visualiza datos y completa formulario de vitales
7. Ejecuta: `POST /api/pacientes/registrar-con-vitales`
8. Backend verifica/crea automáticamente Paciente (si no existe)
9. Backend verifica/crea automáticamente Expediente en estado PENDIENTE (si no existe)
10. Backend crea RegistroMedico con datos vitales vinculado al Expediente
11. Expediente permanece en estado PENDIENTE (aguardando diagnóstico de la Médica)

---

### Flujo 2: Médica - Diagnóstico

[IMAGEN 9: secuencia-medica-detallada.png - Diagrama de secuencia completo]

**APIs usadas:** `GET /api/pacientes/sin-diagnostico`, `POST /api/registros-medicos/diagnostico`

**Pasos del flujo:**
1. Médica inicia sesión en el sistema (Backend genera JWT)
2. Ve el dashboard con opciones
3. Selecciona "Diagnosticar"
4. Sistema ejecuta: `GET /api/pacientes/sin-diagnostico` 
5. Muestra lista de pacientes con expedientes en estado "PENDIENTE"
6. Médica selecciona un paciente
7. Sistema carga: `GET /api/expedientes/paciente/{pacienteId}`
8. Médica revisa historial de vitales registrados por enfermera: `GET /api/registros-medicos/expediente/{id}`
9. Ingresa diagnóstico, medicamentos, plan de seguimiento e historia clínica
10. Ejecuta: `POST /api/registros-medicos/diagnostico`
11. Backend crea RegistroMedico con datos de diagnóstico
12. **Automáticamente**: Expediente cambia de estado "PENDIENTE" a "COMPLETADO"
13. Paciente ahora puede ver su expediente completo

---

### Flujo 3: Médica - Consultar Historial de Pacientes

[IMAGEN S4: secuencia-medica-historial.png - Diagrama de secuencia]

**APIs usadas:** `GET /api/expedientes`, `GET /api/expedientes/{id}`, `GET /api/registros-medicos/expediente/{id}`

**Pasos del flujo:**
1. Médica inicia sesión en el sistema (Backend genera JWT)
2. Ve el dashboard con opciones
3. Selecciona "Ver Historial" o "Consultar Pacientes"
4. Sistema obtiene: `GET /api/expedientes` (lista de todos los expedientes)
5. Médica selecciona un expediente específico
6. Sistema carga: `GET /api/expedientes/{id}` con datos del expediente
7. Médica revisa: `GET /api/registros-medicos/expediente/{id}`
8. Visualiza cronológicamente todos los registros (vitales + diagnósticos previos)
9. Puede ver historial completo sin modificar nada

---

### Flujo 4: Paciente - Consulta de Historial

[IMAGEN 10: secuencia-paciente-detallada.png - Diagrama de secuencia completo]

**APIs usadas:** `GET /api/expedientes/mio`, `GET /api/registros-medicos/expediente/{id}`, `GET /api/usuarios/perfil`

**Pasos del flujo:**
1. Paciente inicia sesión en el sistema (Backend genera JWT)
2. Ejecuta: `GET /api/usuarios/perfil` para cargar su información
3. Ve el dashboard con opción "Ver Historial Médico"
4. Sistema ejecuta: `GET /api/expedientes/mio` 
5. Si NO tiene expediente creado:
   - Muestra mensaje: "El paciente no tiene un expediente médico registrado. Será creado cuando la enfermera te registre."
6. Si YA tiene expediente:
   - Sistema obtiene: `GET /api/registros-medicos/expediente/{id}`
   - Muestra lista de todos los registros (vitales + diagnósticos)
7. Paciente selecciona un registro específico
8. Visualiza la información completa de esa consulta (vitales, diagnóstico, medicamentos, plan de seguimiento)

---

## BASE DE DATOS

### Tablas principales:

El backend crea automáticamente estas 6 tablas (gracias a `ddl-auto=update`):

| Tabla | Propósito | Relación |
|-------|-----------|----------|
| **usuarios** | Datos de login (email, contraseña, rol) | ← tienen rol |
| **roles** | ENFERMERA, MEDICA, PACIENTE | → tienen usuarios |
| **pacientes** | Info personal (nombre, cédula, fecha nacimiento) | ← OneToOne usuario |
| **expedientes** | Expediente médico del paciente | ← OneToOne paciente, OneToMany registros |
| **registros_medicos** | Vitales + diagnósticos + plan seguimiento | ← ManyToOne expediente, ManyToOne usuario |
| **password_reset_tokens** | Tokens de recuperación de contraseña | ← ManyToOne usuario |

### Concepto clave:

[IMAGEN 3: entidad-relacion.png - Diagrama ER con las 6 tablas]

### Ver datos:

```bash
mysql -u root -p expediente_medico

SELECT * FROM usuarios;
SELECT * FROM registros_medicos ORDER BY fecha_registro DESC;
DESCRIBE usuarios;
```

**[SCREENSHOT 5: 05-mysql-data.png - Terminal MySQL: Datos de los usuarios]**

---

## API ENDPOINTS

### Autenticación (`/auth`)

```
POST   /auth/login              Iniciar sesión → { email, password }
POST   /auth/registro           Crear cuenta usuario
POST   /auth/forgot-password    Solicitar código de recuperación
POST   /auth/verify-code        Verificar código de recuperación
POST   /auth/reset-password     Cambiar contraseña con token
```

### Usuarios (`/api/usuarios`)

```
POST   /api/usuarios            Crear usuario (Admin)
GET    /api/usuarios            Listar todos
GET    /api/usuarios/perfil     Mi perfil (Autenticado)
```

### Pacientes (`/api/pacientes`)

```
POST   /api/pacientes                          Crear paciente
GET    /api/pacientes                          Listar todos
GET    /api/pacientes/buscar?cedula=XXX        Buscar por cédula (Enfermera/Médica)
GET    /api/pacientes/sin-diagnostico          Pacientes pendientes (Solo Médica)
POST   /api/pacientes/registrar-con-vitales    Registrar paciente con vitales (Enfermera)
```

### Expedientes (`/api/expedientes`)

```
POST   /api/expedientes                    Crear expediente
GET    /api/expedientes                    Listar todos
GET    /api/expedientes/{id}               Obtener por ID
GET    /api/expedientes/mio                Mi expediente (Paciente Autenticado)
GET    /api/expedientes/paciente/{id}      Expediente de un paciente específico
```

### Registros Médicos (`/api/registros-medicos`)

```
POST   /api/registros-medicos                  Crear registro (vitales básicos)
GET    /api/registros-medicos/expediente/{id}  Historial completo del expediente
POST   /api/registros-medicos/diagnostico      Registrar diagnóstico (Solo Médica)
PUT    /api/registros-medicos/{id}             Actualizar diagnóstico/observaciones (Médica)
```

### Roles (`/api/roles`)

```
POST   /api/roles                Crear rol
GET    /api/roles                Listar roles (ENFERMERA, MEDICA, PACIENTE)
```

**Autenticación:** La mayoría de endpoints requiere header: `Authorization: Bearer <token_jwt>`  
**Autorización por Rol:** Algunos endpoints están restringidos mediante `@PreAuthorize("hasRole('MEDICA')")` o similar

---

## TROUBLESHOOTING

### ❌ "Cannot connect to MySQL"

**Error:**
```
java.sql.SQLException: Cannot connect to MySQL server
```

**Soluciones:**
1. Verifica que MySQL está ejecutándose
2. Verifica puerto en `application.properties` (debe ser 3307)
3. Verifica usuario/contraseña sean correctos
4. En Windows: Busca "MySQL80" en Services y reinicia

---

### ❌ "Port 8080 already in use"

**Error:**
```
Port 8080 already in use
```

**Soluciones:**

En PowerShell (como admin):
```powershell
netstat -ano | findstr :8080
taskkill /PID <numero> /F
```

O cambiar puerto en `application.properties`:
```properties
server.port=8081
```

---

### ❌ "npm command not found"

**Solución:** Node.js no está instalado o no está en PATH.

```bash
node --version  # Si falla, instala Node.js desde nodejs.org
npm install -g npm@latest  # Actualiza npm
```

---

### ❌ "CORS error"

**Error en navegador:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solución:** Reinicia el backend. Si persiste, verifica que existe `CorsConfig.java` en `src/.../config/`.

---

### ❌ "Tables don't exist"

**Error:**
```
Table 'expediente_medico.usuarios' doesn't exist
```

**Solución:**

Verifica en `application.properties`:
```properties
spring.jpa.hibernate.ddl-auto=update  # NO debe ser "none"
```

Reinicia el backend y espera a que cree las tablas.

---

### ❌ "Conexión rechazada en Frontend"

**El frontend no puede conectar al backend**

**Soluciones:**
1. Verifica que backend está ejecutándose en puerto 8080
2. Verifica URL de API en frontend: `http://localhost:8080`
3. Revisa la consola del navegador (F12) para ver el error exacto

---

## NOTAS DE DESARROLLO

### Convenciones de código:

1. **Rutas API:** Siempre con `/api`
2. **Nombrado:** snake_case en BD, camelCase en Java/JS
3. **DTOs:** Para transferencia de datos (no exponer entidades)
4. **Services:** Lógica de negocio aquí, no en controladores
5. **Controladores:** Solo orquestar request/response

### Estructura de respuesta API:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operación exitosa"
}
```

### Agregar una nueva funcionalidad:

1. Crear **Entidad** en `model/`
2. Crear **Repository** en `repository/` (extiende JpaRepository)
3. Crear **Service** en `service/` (lógica)
4. Crear **Controller** en `controller/` (endpoints)
5. Crear **DTOs** en `dto/` si necesita transferencia

### Compilar a JAR:

```bash
mvnw.cmd clean package
java -jar target/expedientemedico-*.jar
```

---

## REFERENCIAS Y RECURSOS

- **Spring Boot Docs:** https://spring.io/projects/spring-boot
- **React Docs:** https://react.dev
- **MySQL Docs:** https://dev.mysql.com/doc/
- **JWT:** https://jwt.io

---

**Última actualización:** Marzo 2026  
**Versión:** 1.0  
**Mantenedor:** Equipo de Desarrollo
