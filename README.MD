cat > README.md << 'EOF'
# 🏋️ GymManager

Sistema web de gestión de clientes y membresías para gimnasios pequeños.

## Stack tecnológico
- **Backend:** Java 21 + Spring Boot 3.2 + Spring Security + JPA
- **Base de datos:** PostgreSQL 15
- **Autenticación:** JWT
- **Frontend:** React 18 + React Router 6 + Axios
- **Testing:** JUnit 5
- **CI:** Travis CI

## Requisitos previos
- Java 21
- Maven 3.9+
- PostgreSQL 15
- Node.js 22+

## Instalación

### Base de datos
```sql
CREATE USER postgres WITH PASSWORD 'postgres';
CREATE DATABASE gymdb OWNER postgres;
```

### Backend
```bash
cd backend
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Crear usuario administrador (solo primera vez)
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## Endpoints principales
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/auth/login | Iniciar sesión |
| GET | /api/clients | Listar clientes |
| POST | /api/clients | Crear cliente |
| PUT | /api/clients/{id} | Actualizar cliente |
| DELETE | /api/clients/{id} | Eliminar cliente |
| GET | /api/memberships | Listar membresías |
| POST | /api/memberships | Registrar membresía |

## Autor
Miguel Angel Miranda Velasco — AL07134864  
Universidad Tecmilenio