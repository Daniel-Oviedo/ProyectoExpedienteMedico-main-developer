#  Sistema de Gestión de Expedientes Médicos

Un sistema completo de gestión de expedientes médicos desarrollado con **React** y **Spring Boot**, diseñado para facilitar la administración de consultas, historiales médicos y datos de pacientes.

---
<img width="935" height="793" alt="Screenshot 2026-03-12 095221" src="https://github.com/user-attachments/assets/11e25010-489f-495f-b1ab-b8e9151ca0e8" />

##  Características Principales

-  **Autenticación segura** con JWT y roles de usuario
-  **Gestión de expedientes médicos** completos
-  **Histórico de consultas** detallado
-  **Registro de signos vitales** (presión arterial, peso, altura, temperatura, saturación de oxígeno)
-  **Diagnósticos y tratamientos** registrados por médicos
-  **Panel de control** personalizado por rol de usuario
-  **Tres roles principales**: Paciente, Enfermera, Médica
-  **Interfaz responsiva** y fácil de usar
-  **Edición de consultas** antes del diagnóstico final
-  **Búsqueda y filtrado** de pacientes y registros

---

##  Stack Tecnológico

### Frontend
- **React** 19.2.0 - Librería UI
- **Vite** 7.2.4 - Bundler y herramienta de desarrollo
- **React Router** 7.12.0 - Navegación
- **Axios** 1.13.2 - Cliente HTTP
- **RSuite** 6.1.2 - Componentes UI avanzados
- **CSS Modular** - Arquitectura BEM

### Backend
- **Spring Boot** 3.5.9 - Framework REST
- **Java** 21 - Lenguaje de programación
- **Spring Security** - Autenticación y autorización
- **JWT (jjwt)** - Tokens de autenticación
- **Spring Data JPA** - ORM
- **MySQL** 8.0+ - Base de datos

---

##  Requisitos Previos

Asegúrate de tener instalado:

- **Node.js** 16+ y npm
- **Java** 21 (JDK)
- **Maven** 3.8+
- **MySQL** 8.0+
- **Git**

---

##  Instalación y Configuración

### 1️ Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/ProyectoExpedienteMedico.git
cd ProyectoExpedienteMedico
```

### 2️ Configurar Base de Datos (MySQL)

Abre MySQL y ejecuta:

```sql
CREATE DATABASE expediente_medico;
USE expediente_medico;
```

Luego ejecuta el script de inicialización incluido en el proyecto:

```bash
mysql -u root -p expediente_medico < init_usuarios.sql
```

### 3️ Configurar Backend

Edita el archivo `src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3307/expediente_medico
spring.datasource.username=root
spring.datasource.password=tu_contraseña
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.properties.hibernate.format_sql=true

# Server Configuration
server.port=8080
server.servlet.context-path=/
```

### 4️ Instalar Dependencias del Backend

```bash
mvn clean install -DskipTests
```

### 5️ Instalar Dependencias del Frontend

```bash
cd frontend
npm install
```

---

##  Ejecutar en Desarrollo

### Backend

```bash
# Desde la raíz del proyecto
mvn spring-boot:run
```

El backend estará disponible en: **http://localhost:8080**

### Frontend

```bash
# Desde la carpeta frontend
npm run dev
```

El frontend estará disponible en: **http://localhost:5173**

---

##  Estructura del Proyecto

```
ProyectoExpedienteMedico/
├── frontend/
│   ├── src/
│   │   ├── components/           # Componentes React
│   │   │   ├── auth/             # Componentes de autenticación
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── RegistroForm.jsx
│   │   │   ├── dashboard/        # Dashboard principal
│   │   │   │   ├── MenuNavigation.jsx
│   │   │   │   └── ProfileCard.jsx
│   │   │   ├── medica/           # Panel de médica
│   │   │   │   ├── MedicaMenu.jsx
│   │   │   │   ├── PacientesList.jsx
│   │   │   │   ├── ExpedientesList.jsx
│   │   │   │   ├── HistorialConsulta.jsx
│   │   │   │   └── RegistroDiagnosticoForm.jsx
│   │   │   ├── enfermera/        # Panel de enfermera
│   │   │   │   ├── BuscarPaciente.jsx
│   │   │   │   └── RegistrarVitales.jsx
│   │   │   ├── paciente/         # Panel de paciente
│   │   │   │   ├── InfoPaciente.jsx
│   │   │   │   └── HistorialMedico.jsx
│   │   │   ├── expediente/       # Gestión de expedientes
│   │   │   │   ├── ExpedienteInfo.jsx
│   │   │   │   └── ExpedienteActions.jsx
│   │   │   ├── registros/        # Gestión de registros
│   │   │   │   ├── RegistrosList.jsx
│   │   │   │   ├── RegistrosFilter.jsx
│   │   │   │   └── RegistroVitalesForm.jsx
│   │   │   ├── ui/               # Componentes UI reutilizables
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/                # Páginas principales
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── MedicaPage.jsx
│   │   │   ├── EnfermeraPage.jsx
│   │   │   ├── PacientePage.jsx
│   │   │   ├── ExpedientePage.jsx
│   │   │   ├── RegistroPage.jsx
│   │   │   └── CrearRegistroPage.jsx
│   │   ├── services/             # Servicios API
│   │   │   ├── api.js            # Configuración Axios
│   │   │   ├── authService.js
│   │   │   ├── pacienteService.js
│   │   │   ├── expedienteService.js
│   │   │   └── registroMedicoService.js
│   │   ├── hooks/                # Custom Hooks
│   │   │   ├── useFetchPacientes.js
│   │   │   ├── useFetchExpedientes.js
│   │   │   ├── useFetchRegistros.js
│   │   │   ├── useFormValidation.js
│   │   │   └── useRegistroDiagnostico.js
│   │   ├── context/              # Context API
│   │   │   ├── AuthContext.jsx
│   │   │   ├── PacienteContext.jsx
│   │   │   └── ExpedienteContext.jsx
│   │   ├── constants/            # Constantes
│   │   │   ├── index.js
│   │   │   ├── routes.js
│   │   │   └── messages.js
│   │   ├── utils/                # Utilidades
│   │   │   ├── formatters.js
│   │   │   ├── validators.js
│   │   │   └── index.js
│   │   ├── styles/               # Estilos CSS
│   │   │   ├── global.css
│   │   │   ├── auth.css
│   │   │   ├── components.css
│   │   │   ├── components/
│   │   │   └── pages/
│   │   ├── assets/               # Imágenes y recursos
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── index.html
│
├── src/main/java/com/manager/expedientemedico/
│   ├── controller/               # Controladores REST
│   │   ├── AuthController.java
│   │   ├── PacienteController.java
│   │   ├── UsuarioController.java
│   │   ├── ExpedienteController.java
│   │   ├── RegistroMedicoController.java
│   │   └── RolController.java
│   ├── service/                  # Lógica de negocio
│   │   ├── AuthService.java
│   │   ├── UsuarioService.java
│   │   ├── PacienteService.java
│   │   ├── ExpedienteService.java
│   │   └── RegistroMedicoService.java
│   ├── repository/               # Acceso a datos
│   │   ├── UsuarioRepository.java
│   │   ├── PacienteRepository.java
│   │   ├── ExpedienteRepository.java
│   │   ├── RegistroMedicoRepository.java
│   │   └── RolRepository.java
│   ├── model/                    # Entidades JPA
│   │   ├── Usuario.java
│   │   ├── Paciente.java
│   │   ├── Expediente.java
│   │   ├── RegistroMedico.java
│   │   └── Rol.java
│   ├── dto/                      # Data Transfer Objects
│   │   ├── auth/
│   │   │   ├── LoginRequestDTO.java
│   │   │   ├── LoginResponseDTO.java
│   │   │   └── RegistroRequestDTO.java
│   │   ├── UsuarioResponseDTO.java
│   │   ├── PacienteResponseDTO.java
│   │   ├── RegistroMedicoRequestDTO.java
│   │   └── RegistroMedicoResponseDTO.java
│   ├── security/                 # Configuración de seguridad
│   │   ├── SecurityConfig.java
│   │   ├── JwtAuthenticationFilter.java
│   │   └── SecurityUtils.java
│   ├── config/                   # Configuraciones
│   │   └── AppConfig.java
│   ├── exception/                # Excepciones personalizadas
│   │   ├── RecursoNoEncontradoException.java
│   │   └── OperacionNoPermitidaException.java
│   └── ExpedientemedicoApplication.java
│
├── src/main/resources/
│   └── application.properties     # Configuración de la aplicación
│
├── pom.xml                        # Dependencias Maven
├── mvnw / mvnw.cmd               # Maven Wrapper
├── init_usuarios.sql             # Script inicialización base de datos
└── README.md                      # Este archivo
```

---

##  Roles de Usuario

###  PACIENTE
-  Ver información personal
-  Consultar histórico médico completo
-  Revisar resultados de consultas y diagnósticos
-  Ver signos vitales registrados
-  Ver detalle de cada consulta

###  ENFERMERA
-  Buscar pacientes
-  Registrar nuevas consultas
-  Cargar signos vitales del paciente
-  Ver expedientes en modo lectura
-  Acceder a información médica básica

###  MÉDICA
-  Ver listado de todos los pacientes
-  Revisar expedientes médicos completos
-  Acceder al histórico de todas las consultas
-  Registrar diagnósticos y tratamientos
-  **Editar información de consultas** antes del diagnóstico
-  Visualizar signos vitales detallados
-  Gestionar toda la información médica

---

##  Credenciales de Prueba

Una vez ejecutado `init_usuarios.sql`, puedes usar las siguientes credenciales para probar:

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Médica | `medica@clinica.com` | `123456` |
| Enfermera | `enfermera@clinica.com` | `123456` |
| Paciente | `paciente@clinica.com` | `123456` |

---

##  Endpoints Principales

### Autenticación
```
POST   /auth/login              - Iniciar sesión
POST   /auth/registro           - Registrarse como paciente
```

### Usuarios
```
GET    /api/usuarios            - Listar usuarios
GET    /api/usuarios/{id}       - Obtener usuario por ID
```

### Pacientes
```
GET    /api/pacientes           - Listar todos los pacientes
GET    /api/pacientes/{id}      - Obtener paciente por ID
GET    /api/pacientes/buscar    - Buscar paciente por cédula
POST   /api/pacientes           - Crear nuevo paciente
PUT    /api/pacientes/{id}      - Actualizar paciente
```

### Expedientes
```
GET    /api/expedientes         - Listar todos los expedientes
GET    /api/expedientes/{id}    - Obtener expediente por ID
POST   /api/expedientes         - Crear nuevo expediente
```

### Registros Médicos
```
GET    /api/registros-medicos/expediente/{id}   - Histórico de consultas
POST   /api/registros-medicos                   - Crear nueva consulta
PUT    /api/registros-medicos/{id}              - Editar información de consulta
POST   /api/registros-medicos/diagnostico       - Registrar diagnóstico
```

### Roles
```
GET    /api/roles               - Listar todos los roles
```

---

##  Flujo Principal de la Aplicación

### 1. Registro e Ingreso
```
Usuario anónimo
    ↓
Hacer clic en "Crear cuenta"
    ↓
Rellenar formulario de registro (cédula, nombre, email, contraseña)
    ↓
Ser redirigido a login
    ↓
Ingresar credenciales
    ↓
Recibir token JWT
    ↓
Acceso al sistema como PACIENTE
```

### 2. Consulta Médica (Enfermera)
```
Enfermera inicia sesión
    ↓
Dashboard de Enfermera
    ↓
Busca paciente por cédula
    ↓
Abre expediente del paciente
    ↓
Crea nueva consulta
    ↓
Registra signos vitales
    ↓
Guarda registro
    ↓
Consulta queda pendiente para diagnóstico
```

### 3. Diagnóstico (Médica)
```
Médica inicia sesión
    ↓
Ve listado de pacientes
    ↓
Revisa expediente del paciente
    ↓
Ve histórico de consultas
    ↓
Selecciona una consulta (sin diagnóstico aún)
    ↓
Puede editar información de signos vitales
    ↓
Registra diagnóstico y tratamiento
    ↓
Consulta se marca como completada
```

### 4. Consulta de Histórico (Paciente)
```
Paciente inicia sesión
    ↓
Va a "Mi Histórico Médico"
    ↓
Ve listado de sus consultas (número y fecha)
    ↓
Selecciona una consulta
    ↓
Ve todos los detalles: signos vitales, diagnóstico, tratamiento
    ↓
Puede volver a ver otra consulta
```

---

##  Troubleshooting

### Error: "Failed to connect to database"
**Solución:**
- Verifica que MySQL esté ejecutándose en tu máquina
- Revisa las credenciales en `src/main/resources/application.properties`
- Asegúrate que la base de datos `expediente_medico` existe
- Confirma que el puerto MySQL es correcto (default: 3306, en tu caso: 3307)

### Error: "403 Forbidden" en registro/login
**Solución:**
- Limpia el localStorage del navegador (F12 → Application → Local Storage → Clear all)
- Abre la ventana de incógnito/privada y vuelve a intentar
- Verifica que el backend está corriendo en http://localhost:8080
- Revisa los logs del backend para más detalles

### Error: "Token JWT inválido"
**Solución:**
- Limpia el localStorage completamente
- Cierra la sesión y vuelve a iniciar
- Asegúrate que la `SECRET_KEY` en `JwtAuthenticationFilter.java` es correcta

### Puerto 8080 en uso
```bash
# En application.properties, cambia:
server.port=8081
```

### Puerto 5173 en uso
```bash
# En terminal frontend:
npm run dev -- --port 5174
```

### Problema: "npm: command not found"
**Solución:**
- Instala Node.js desde https://nodejs.org/
- Reinicia la terminal
- Verifica con: `node --version` y `npm --version`

### Problema: "Maven not found"
**Solución:**
- Instala Maven desde https://maven.apache.org/
- O usa el Maven Wrapper incluido: `./mvnw` (Linux/Mac) o `mvnw.cmd` (Windows)

---

##  Build para Producción

### Frontend - Generar archivos estáticos

```bash
cd frontend
npm run build
```

Los archivos compilados estarán en `frontend/dist/`

### Backend - Generar JAR ejecutable

```bash
mvn clean package -DskipTests
```

El JAR estará en `target/expedientemedico-0.0.1-SNAPSHOT.jar`

**Ejecutar el JAR:**
```bash
java -jar target/expedientemedico-0.0.1-SNAPSHOT.jar
```

##  Responsive Design

La aplicación está completamente optimizada para:

-  **Desktop** (1920px+) - Vista completa con todos los detalles
-  **Tablet** (768px - 1024px) - Interfaz adaptada, menú colapsable
-  **Mobile** (< 768px) - Vista móvil optimizada, botones grandes

---

##  Base de Datos - Diagrama

```
USUARIOS (1)─────────────┬─── ROLES
                         │
                    (N)  │
                         │
PACIENTES (1)────────────┼─ EXPEDIENTES (N)────┬──── REGISTROS_MEDICOS (N)
   (cédula)              └─────┐                │
   (nombre)                    │                │
   (email)              EXPEDIENTE          MEDICA
   (estado)              (información        (diagnóstico)
                          del paciente)      (observaciones)

USUARIOS:
- usuario_id (PK)
- email (UNIQUE)
- contraseña (BCRYPT)
- rol_id (FK)
- estado

PACIENTES:
- paciente_id (PK)
- cedula (UNIQUE)
- nombre
- email
- usuario_id (FK)

EXPEDIENTES:
- expediente_id (PK)
- paciente_id (FK)
- fecha_creacion
- estado

REGISTROS_MEDICOS:
- registro_id (PK)
- expediente_id (FK)
- observaciones
- presion_arterial
- peso
- altura
- temperatura
- saturacion_oxigeno
- diagnostico
- tratamiento
- fecha_consulta
```

---

##  Documentación Adicional

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [JWT Introduction](https://jwt.io/introduction)
- [MySQL Documentation](https://dev.mysql.com/doc/)

---



##  Autor

**Marco Daniel Oviedo Ballestero**
- Email: danielovi18@hotmail.com

##  Versión

- **Versión Actual**: 0.0.1 (Beta)
- **Última Actualización**: Marzo 2026
- **Estado**: En Desarrollo

---

##  Próximas Mejoras (Roadmap)

- [ ] Exportar expedientes a PDF
- [ ] Notificaciones por email
- [ ] Sistema de citas médicas
- [ ] Gráficos de evolución de signos vitales
- [ ] Integración con calendarios
- [ ] Aplicación móvil nativa
- [ ] Autenticación con 2FA
- [ ] Auditoría de cambios
- [ ] Reportes avanzados
- [ ] Sistema de medicamentos
