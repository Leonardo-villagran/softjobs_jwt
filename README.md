# API de Registro y Login de Usuarios en Express

>Tarea 6: Autenticación y Autorización de usuarios con JWT de DesafioLatam para el módulo: Backend con Node y Express (G27).

Aplicación en Express que proporciona endpoints de API para el registro y login de usuarios. Permite al front-end registrar nuevos usuarios con correo electrónico, contraseña, rol y lenguaje de programación. La aplicación utiliza JWT (JSON Web Tokens) para la autenticación y autorización de usuarios. Además, se implementa un middleware para generar reportes de las solicitudes recibidas.

## Requisitos

- Node.js
- npm (Administrador de paquetes de Node.js)
- PostgreSQL (Base de datos)

## Instalación

1. Instalación
* Clona el repositorio:

```markdown
git clone https://github.com/Leonardo-villagran/softjobs_jwt
```
2. Instala las dependencias:

```makefile
cd softjobs_jwt
npm install
```
3. Configuración de variables de entorno:

* Crea un archivo .env en la raíz del proyecto.
* Agrega las siguientes variables y proporciona los valores correspondientes (los datos presentados son solo de ejemplo, utilizar los propios que correspondan a su configuración).
* Reemplaza tu_clave_secreta con una clave secreta fuerte para la generación del token JWT.

``` bash
##Config localhost 
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=softjobs
JWT_SECRET=desafio_latam
PORT=3000
```

4. Iniciar el servidor:

```arduino
npm run start
```
o
```arduino
npm run dev
```
La API estará disponible en `http://localhost:3000`.

## Uso
La API proporciona los siguientes endpoints:
### Registro de Usuario

* URL: `POST /usuarios`
* Cuerpo de la solicitud:

```json
{
  "email": "usuario@example.com",
  "password": "contraseña",
  "rol": "rol del usuario",
  "lenguaje": "lenguaje de programación preferido"
}
```

*Respuesta exitosa (Código 201):
```
Usuario creado con éxito
```
* Error de registro:
```go
Mensaje de error
```
### Login de Usuario

* URL: `POST /login`
* Cuerpo de la solicitud:

```json
{
  "email": "usuario@example.com",
  "password": "contraseña"
}
```
* Respuesta exitosa (Código 200):
```
Token JWT válido
```
*Error de login:
```go
Mensaje de error
```

### Obtener Datos de Usuario
* URL: `GET /usuarios`
* Encabezados:
  * Authorization: `Bearer <token>`
* Respuesta exitosa (Código 200):

```json
{
  "email": "usuario@example.com",
  "rol": "rol del usuario",
  "lenguaje": "lenguaje de programación preferido"
}

```
* Error de autorización:

```go
Mensaje de error
```

## Middlewares
-La aplicación utiliza middlewares para el uso de cors y json. 
-Se genera un middleware para obtener un reporte de las distintas solicitudes.
-Se genera un middleware para determinar si hay conexión a la base de datos.
-Se genera un middleware para verificar si los datos de usuario ingresados en el formulario de registro están completos.
-Se genera un middleware para verificar si las credenciales se ingresan de forma correcta antes de crear el token.
-Se genera un middleware para determinar si el token de usuario existe y luego validarlo para el acceso de rutas protegidas. 

## Manejo de Errores
La aplicación captura y maneja los errores utilizando bloques try-catch. Los errores se devuelven con códigos de estado adecuados y mensajes descriptivos en la respuesta.

## Seguridad
* Las contraseñas se almacenan de forma encriptada en la base de datos.
* Se utiliza JWT (JSON Web Tokens) para la autenticación y autorización de usuarios.
* Se implementa una verificación básica de autorización utilizando el token JWT para proteger las rutas de la API. El token se envía en el encabezado Authorization con el prefijo `Bearer`.
* El sistema no permite que se ingresen dos usuarios con el mismo e-mail.
