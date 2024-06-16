# Blog Example API

Esta es una API desarrollada en el módulo 3 (Desarrollo de Aplicaciones web – Backend). Sirve para gestionar un blog y fue desarrollado utilizando NestJS, PostgreSQL y JWT para la autenticación. La API permite crear, leer, actualizar, eliminar usuarios y añadir un profile, todas las anteriores a partir de rutas protegidas. Por otro lado, se puede crear post si se está autenticado, la lectura de post no requiere autenticación. Finalmente tambien se considero la llamada a una API externa, esa URL es de acceso libre.

## Trabajo para el Módulo Aseguramiento de calidad y pruebas E2E

En relación a las pruebas unitarias, se desarrollaron 19 pruebas unitarias que se encuentran en los archivos `users/users.service.spec.ts` y `users/users.controller.spec.ts`.

En relación a las pruebas de integración, se desarrollaron 10 pruebas de integración que se encuentran en los archivos `users/users.controller.integration.spec.ts` y `users/users.controller.e2e.spec.ts`.

## Requisitos de funcionamiento

- PostgreSQL (version 15 o superior)
- Node.js (versión 20 o superior)
- npm (versión 10 o superior)

## Instalación

Sigue los pasos a continuación para instalar y ejecutar la aplicación:

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/HuascarFedor/blognest-app.git
   cd blognest-app
   ```

2. Instalar las dependencias:

   ```bash
   npm install
   ```

3. Crear las bases de datos:

   - Crea un par de bases de datos con los nombres: `trabajofinal` y `trabajofinaltest`.

4. Configurar el archivo `.env` y `.env.test`:

   - En el directorio raiz encontrarás dos archivos: `env_example` y `env.test_example`, elimina `_exaple` en ambos archivos, para tener como resultado los archivos `.env` y `.env.test`.
   - Modifica las variables de acuerdo a los valores de instalación de tu base de datos.

5. Iniciar la aplicación:

   ```bash
   npm run start:dev
   ```

6. Acceder a la documentación de la API:
   - Abre tu navegador y navega a `http://localhost:3000/docs` para ver la documentación de Swagger.

## Uso

### Autenticación

La API utiliza JWT para la autenticación. Para acceder a las rutas protegidas, primero debes iniciar sesión y obtener un token.

#### Inicio de sesión

```bash
POST /auth/login
```

Cuerpo de la solicitud:

```json
{
  "username": "Admin123456",
  "password": "HF$123456"
}
```

Es un usario predefinido en el sistema.

Respuesta:

```json
{
  "access_token": "your_jwt_token"
}
```

### Gestión de usuarios

#### Crear usuario

```bash
POST /users
```

Encabezados:

```plaintext
Authorization: Bearer your_jwt_token
```

Cuerpo de la solicitud:

```json
{
  "username": "Nombre Usuario",
  "password": "Abcd$1234567",
  "roles": ["AUTHOR"]
}
```

#### Obtener todos los usuarios

```bash
GET /users
```

Encabezados:

```plaintext
Authorization: Bearer your_jwt_token
```

#### Obtener un usuario por ID

```bash
GET /users/:id
```

Encabezados:

```plaintext
Authorization: Bearer your_jwt_token
```

#### Actualizar usuario

```bash
PATCH /users/:id
```

Encabezados:

```plaintext
Authorization: Bearer your_jwt_token
```

Cuerpo de la solicitud:

```json
{
  "username": "Nuevo nombre",
  "password": "Otro$p4ssw0rd"
}
```

#### Eliminar usuario

```bash
DELETE /users/:id
```

Encabezados:

```plaintext
Authorization: Bearer your_jwt_token
```

#### Añadir un profile

```bash
POST /users/:id/profile
```

Encabezados:

```plaintext
Authorization: Bearer your_jwt_token
```

Cuerpo de la solicitud:

```json
{
  "firstname": "string",
  "lastname": "string",
  "age": 25
}
```

#### Crear un post

```bash
POST /posts
```

Encabezados:

```plaintext
Authorization: Bearer your_jwt_token
```

Cuerpo de la solicitud:

```json
{
  "title": "string",
  "content": "string",
  "authorId": 0
}
```

#### Obtener todos los posts

```bash
GET /posts
```

#### Acceder a API externa

```bash
GET /posts/list/api
```

## Testing

Sigue los pasos a continuación para ejecutar las pruebas unitarias y de integración

1. Ejecutar las pruebas:

   ```bash
   npm run test
   ```
