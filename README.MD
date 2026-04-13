# 🏋️ GymManager

> Sistema web de gestión de clientes y membresías para gimnasios pequeños.

[![Build Status](https://app.travis-ci.com/Mike1720/gym-management-system.svg?branch=main)](https://app.travis-ci.com/Mike1720/gym-management-system)
![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green)
![React](https://img.shields.io/badge/React-18-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)

---

## 📋 Tabla de contenidos

- [Descripción](#-descripción)
- [Problema identificado](#-problema-identificado)
- [Solución](#-solución)
- [Arquitectura](#-arquitectura)
- [Requerimientos](#-requerimientos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Contribución](#-contribución)
- [Roadmap](#-roadmap)

---

## 📖 Descripción

GymManager es un sistema web de Producto Mínimo Viable (MVP) orientado a centralizar la gestión de clientes y control de membresías en gimnasios pequeños. Permite registrar clientes, controlar pagos, y visualizar el estado de las membresías desde una interfaz web simple e intuitiva.

---

## 🔍 Problema identificado

Los gimnasios pequeños presentan dificultades en la gestión de su información debido al uso de métodos manuales o herramientas no especializadas como hojas de cálculo. Las problemáticas principales son:

- Registro desorganizado de clientes
- Falta de control sobre pagos y membresías
- Dificultad para identificar clientes con membresía vencida
- Pérdida o duplicidad de información
- Procesos administrativos lentos

---

## 💡 Solución

Sistema web cliente-servidor que centraliza la gestión de clientes y membresías en una sola plataforma, permitiendo:

- Registrar y administrar clientes (CRUD completo)
- Controlar pagos y fechas de vencimiento de membresías
- Consultar el estado de membresías (activa / vencida)
- Acceso seguro mediante autenticación con JWT

---

## 🏗️ Arquitectura

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│                 │  HTTP   │                  │   JPA   │                 │
│  React Frontend │◄───────►│ Spring Boot API  │◄───────►│   PostgreSQL    │
│  (Vercel)       │  REST   │  (Railway)       │         │   (Railway)     │
│                 │         │                  │         │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
```

**Componentes:**

| Capa          | Tecnología                     | Responsabilidad                |
| ------------- | ------------------------------- | ------------------------------ |
| Frontend      | React 18 + React Router + Axios | Interfaz de usuario            |
| Backend       | Java 21 + Spring Boot 3.2       | Lógica de negocio + REST API  |
| Seguridad     | Spring Security + JWT           | Autenticación y autorización |
| Base de datos | PostgreSQL 15 + JPA/Hibernate   | Persistencia de datos          |

---

## ⚙️ Requerimientos

### Servidores

| Componente              | Requerimiento                                                |
| ----------------------- | ------------------------------------------------------------ |
| Servidor de aplicación | Java 21 + Spring Boot embebido (Tomcat)                      |
| Servidor web            | React (Vercel en producción / localhost:3000 en desarrollo) |
| Base de datos           | PostgreSQL 15+                                               |

### Versiones requeridas

| Herramienta  | Versión mínima |
| ------------ | ---------------- |
| Java (JDK)   | 21               |
| Apache Maven | 3.9+             |
| Node.js      | 18+              |
| npm          | 9+               |
| PostgreSQL   | 15+              |

### Paquetes principales (Backend)

| Paquete                      | Versión |
| ---------------------------- | -------- |
| spring-boot-starter-web      | 3.2.0    |
| spring-boot-starter-security | 3.2.0    |
| spring-boot-starter-data-jpa | 3.2.0    |
| jjwt-api                     | 0.11.5   |
| postgresql                   | runtime  |
| lombok                       | latest   |

### Paquetes principales (Frontend)

| Paquete          | Versión |
| ---------------- | -------- |
| react            | 18.2.0   |
| react-router-dom | 6.20.0   |
| axios            | 1.6.0    |

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Mike1720/gym-management-system.git
cd gym-management-system
```

### 2. Configurar Java 21

```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home
java -version  # Debe mostrar Java 21
```

### 3. Configurar la base de datos

Asegúrate de tener PostgreSQL corriendo:

```bash
brew services start postgresql@15
```

Crear la base de datos:

```bash
psql postgres
```

```sql
CREATE USER postgres WITH PASSWORD 'postgres';
CREATE DATABASE gymdb OWNER postgres;
GRANT ALL PRIVILEGES ON DATABASE gymdb TO postgres;
\q
```

### 4. Instalar y correr el Backend

```bash
cd backend
mvn spring-boot:run
```

El backend quedará disponible en `http://localhost:8080`

### 5. Instalar y correr el Frontend

```bash
cd frontend
npm install
npm start
```

El frontend quedará disponible en `http://localhost:3000`

### 6. Crear usuario administrador (solo la primera vez)

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 🧪 Cómo ejecutar pruebas manualmente

```bash
cd backend
mvn test -Dspring.profiles.active=test
```

Las pruebas usan H2 (base de datos en memoria), por lo que **no requieren PostgreSQL** para ejecutarse.

Pruebas incluidas:

- `AuthServiceTest` — login exitoso, credenciales inválidas, registro, usuario duplicado
- `ClientServiceTest` — crear, listar, actualizar, eliminar, buscar, correo duplicado

---

## ☁️ Implementación en producción

### Backend en Railway

1. Entra a [railway.app](https://railway.app) e inicia sesión con GitHub
2. Haz clic en **New Project** → **Deploy from GitHub repo**
3. Selecciona `gym-management-system`
4. Railway detectará el `Procfile` automáticamente
5. Agrega un servicio **PostgreSQL** desde el dashboard de Railway
6. En el servicio del backend, agrega las siguientes variables de entorno:

| Variable         | Valor                                                       |
| ---------------- | ----------------------------------------------------------- |
| `DATABASE_URL` | (Railway lo genera automáticamente al conectar PostgreSQL) |
| `JWT_SECRET`   | (genera uno seguro, mínimo 32 caracteres)                  |
| `FRONTEND_URL` | (URL de Vercel, se agrega después del deploy del frontend) |

7. Railway generará una URL pública para el backend (ej: `https://gym-backend.up.railway.app`)

### Frontend en Vercel

1. Entra a [vercel.com](https://vercel.com) e inicia sesión con GitHub
2. Haz clic en **Add New Project**
3. Selecciona `gym-management-system`
4. En **Root Directory** selecciona `frontend`
5. Agrega la variable de entorno:

| Variable              | Valor                                         |
| --------------------- | --------------------------------------------- |
| `REACT_APP_API_URL` | `https://TU-URL-RAILWAY.up.railway.app/api` |

6. Haz clic en **Deploy**
7. Vercel generará una URL pública (ej: `https://gym-management.vercel.app`)
8. Regresa a Railway y actualiza `FRONTEND_URL` con la URL de Vercel.

---

## 🔧 Configuración

### Archivos de configuración

| Archivo                                                    | Propósito                              |
| ---------------------------------------------------------- | --------------------------------------- |
| `backend/src/main/resources/application.properties`      | Configuración local (desarrollo)       |
| `backend/src/main/resources/application-prod.properties` | Configuración de producción (Railway) |
| `frontend/.env.development`                              | Variables de entorno desarrollo         |
| `frontend/.env.production`                               | Variables de entorno producción        |
| `frontend/vercel.json`                                   | Configuración de deploy en Vercel      |
| `backend/Procfile`                                       | Comando de inicio para Railway          |

### Variables de entorno (producción)

**Backend (Railway):**

```
DATABASE_URL=jdbc:postgresql://host:port/dbname
JWT_SECRET=tu_secreto_seguro_aqui
FRONTEND_URL=https://tu-app.vercel.app
PORT=8080
```

**Frontend (Vercel):**

```
REACT_APP_API_URL=https://tu-backend.up.railway.app/api
```

---

## 📱 Uso

### Manual de usuario final

#### Iniciar sesión

1. Abre el navegador en la URL del sistema
2. Ingresa tu **usuario** y **contraseña**
3. Haz clic en **Iniciar sesión**

#### Dashboard

- Visualiza el resumen general: total de clientes, membresías activas y vencidas
- Consulta los clientes registrados recientemente con su estado de membresía

#### Gestión de clientes

1. Ve a la sección **Clientes** en el menú lateral
2. **Registrar cliente:** Haz clic en **+ Nuevo cliente**, completa el formulario y guarda
3. **Buscar cliente:** Usa la barra de búsqueda para filtrar por nombre
4. **Editar cliente:** Haz clic en el botón ✏️ junto al cliente
5. **Eliminar cliente:** Haz clic en el botón 🗑️ y confirma la acción

#### Gestión de membresías

1. Ve a la sección **Membresías** en el menú lateral
2. **Registrar membresía:** Haz clic en **+ Nueva membresía**, selecciona el cliente, tipo y monto
3. **Filtrar por estado:** Usa las pestañas **Todas / Activas / Vencidas**
4. **Eliminar membresía:** Haz clic en el botón 🗑️ junto al registro

#### Estados de membresía

| Badge             | Significado                               |
| ----------------- | ----------------------------------------- |
| 🟢 Activa         | La membresía está vigente               |
| 🔴 Vencida        | La fecha de vencimiento ya pasó          |
| ⚪ Sin membresía | El cliente no tiene membresía registrada |

#### Tipos de membresía disponibles

| Tipo       | Duración |
| ---------- | --------- |
| Mensual    | 1 mes     |
| Trimestral | 3 meses   |
| Semestral  | 6 meses   |
| Anual      | 12 meses  |

#### Cerrar sesión

Haz clic en **Cerrar sesión** en la parte inferior del menú lateral.

---

### Manual de usuario administrador

#### Registrar un nuevo administrador

```bash
curl -X POST https://TU-URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"nuevo_admin","password":"contraseña_segura"}'
```

#### Endpoints de la API REST

| Método | Endpoint                            | Descripción            | Auth |
| ------- | ----------------------------------- | ----------------------- | ---- |
| POST    | `/api/auth/login`                 | Iniciar sesión         | No   |
| POST    | `/api/auth/register`              | Registrar administrador | No   |
| GET     | `/api/clients`                    | Listar clientes         | JWT  |
| GET     | `/api/clients?search=nombre`      | Buscar clientes         | JWT  |
| GET     | `/api/clients/{id}`               | Obtener cliente         | JWT  |
| POST    | `/api/clients`                    | Crear cliente           | JWT  |
| PUT     | `/api/clients/{id}`               | Actualizar cliente      | JWT  |
| DELETE  | `/api/clients/{id}`               | Eliminar cliente        | JWT  |
| GET     | `/api/memberships`                | Listar membresías      | JWT  |
| GET     | `/api/memberships?status=activa`  | Filtrar activas         | JWT  |
| GET     | `/api/memberships?status=vencida` | Filtrar vencidas        | JWT  |
| GET     | `/api/memberships/client/{id}`    | Membresías de cliente  | JWT  |
| POST    | `/api/memberships`                | Registrar membresía    | JWT  |
| DELETE  | `/api/memberships/{id}`           | Eliminar membresía     | JWT  |

#### Ejemplo de uso con JWT

```bash
# 1. Login
TOKEN=$(curl -s -X POST https://TU-URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# 2. Usar el token
curl -H "Authorization: Bearer $TOKEN" https://TU-URL/api/clients
```

---

## 🤝 Contribución

### Guía de contribución

#### 1. Clonar el repositorio

```bash
git clone https://github.com/Mike1720/gym-management-system.git
cd gym-management-system
```

#### 2. Crear un nuevo branch

Usa la siguiente convención de nombres:

| Tipo                | Prefijo      | Ejemplo                    |
| ------------------- | ------------ | -------------------------- |
| Nueva funcionalidad | `feature/` | `feature/notificaciones` |
| Corrección de bug  | `fix/`     | `fix/login-error`        |
| Documentación      | `docs/`    | `docs/api-guide`         |

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nombre-de-la-funcionalidad
```

#### 3. Desarrollar y hacer commits

Usa mensajes de commit descriptivos siguiendo el estándar Conventional Commits:

```bash
git add .
git commit -m "feat: descripción clara de lo que hace el commit"
```

| Prefijo    | Uso                            |
| ---------- | ------------------------------ |
| `feat:`  | Nueva funcionalidad            |
| `fix:`   | Corrección de bug             |
| `docs:`  | Documentación                 |
| `test:`  | Pruebas                        |
| `chore:` | Configuración / mantenimiento |

#### 4. Subir el branch

```bash
git push origin feature/nombre-de-la-funcionalidad
```

#### 5. Abrir un Pull Request

1. Ve a `https://github.com/Mike1720/gym-management-system`
2. Haz clic en **Compare & pull request**
3. Asegúrate que la base sea `develop`
4. Describe los cambios realizados
5. Haz clic en **Create pull request**

#### 6. Esperar revisión y merge

- El PR será revisado por el administrador del repositorio
- Una vez aprobado se hará el merge hacia `develop`
- Los cambios llegarán a `master` en el siguiente release

---

## 🗺️ Roadmap

Funcionalidades planificadas para futuras versiones:

### v1.1.0

- [ ] Notificaciones automáticas por correo cuando una membresía está próxima a vencer
- [ ] Exportar listado de clientes a CSV/Excel

### v1.2.0

- [ ] Seguimiento de progreso físico del cliente (peso, medidas)
- [ ] Rutinas de entrenamiento personalizadas por cliente

### v2.0.0

- [ ] Pagos en línea integrados (Stripe / MercadoPago)
- [ ] Reportes avanzados y estadísticas (gráficas de ingresos, retención)
- [ ] Aplicación móvil (React Native)
- [ ] Múltiples sucursales / roles de usuario

---

## 👤 Autor

**Miguel Angel Miranda Velasco**

- Matrícula: AL07134864
- Universidad Tecmilenio
- Taller de Productividad Basada en Herramientas Tecnológicas

---

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos.
