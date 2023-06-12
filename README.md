# API de Registro y Login de Usuarios en Express

>Tarea 6: Autenticación y Autorización de usuarios con JWT de DesafioLatam para el módulo: Backend con Node y Express (G27).

Esta es una aplicación en Express que proporciona endpoints de API para el registro y login de usuarios. Permite al front-end registrar nuevos usuarios con correo electrónico, contraseña, rol y lenguaje de programación. La aplicación utiliza JWT (JSON Web Tokens) para la autenticación y autorización de usuarios. Además, se implementa un middleware para generar reportes de las solicitudes recibidas.

## Instalación

1. Instalación
* Clona el repositorio:

```
git clone https://github.com/tu/repositorio.git
```
2. Instala las dependencias:

```
cd express-user-registration-login-api
npm install
```
3. Configuración de variables de entorno:

* Crea un archivo .env en la raíz del proyecto.
* Agrega las siguientes variables y proporciona los valores correspondientes (los datos presentados son solo de ejemplo, utilizar los propios que correspondan a su configuración):

``` bash
#Variables de entorno
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=softjobs
JWT_SECRET=desafio_latam
PORT=3000
```

* Reemplaza tu_clave_secreta con una clave secreta fuerte para la generación del token JWT.

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
* Error de registro (Código 500):
```
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
*Error de login (Código 500):
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
* Error de autorización (Código 500):

```go
Mensaje de error
```

## Middleware de Reporte
La aplicación utiliza un middleware para generar un reporte de cada solicitud recibida. El reporte se muestra en la consola y contiene la URL, fecha, hora, método y datos del req.body de la solicitud, si la consulta no posee algún dato en el req.body, se realizan condicionales para evitar mostrar campos vacíos.  

## Manejo de Errores
La aplicación captura y maneja los errores utilizando bloques try-catch. Los errores se devuelven con códigos de estado adecuados y mensajes descriptivos en la respuesta.

## Seguridad
* Las contraseñas se almacenan de forma encriptada en la base de datos.
* Se utiliza JWT (JSON Web Tokens) para la autenticación y autorización de usuarios.
* Se implementa una verificación básica de autorización utilizando el token JWT para proteger las rutas de la API. El token se envía en el encabezado Authorization con el prefijo `Bearer`.
