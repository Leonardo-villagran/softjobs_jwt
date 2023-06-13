const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require("jsonwebtoken")
require('dotenv').config();

app.use(cors())
app.use(express.json())

function verificarCredencialesMiddleware(req, res, next) {
    // Verificar si no existen el email, el password o el token en la solicitud
    if (!req.body.email || !req.body.password) {
        // Si alguna de las credenciales no existe, enviar una respuesta de error
        res.status(401).json({ message: 'Credenciales incompletas debe ingresar el email y password' });
    } else {
        // Si todas las credenciales existen, pasar al siguiente middleware o a la ruta
        const { method, originalUrl, body, protocol, hostname } = req;
        // Generar timestamp de hoy
        const timestamp = new Date();
        // Obtener la fecha
        const fecha = timestamp.toISOString().slice(0, 10);
        const fechaLatino = fecha.split('-').reverse().join('/');
        // Obtener la hora
        const hora = timestamp.toTimeString().slice(0, 8);

        // Registra la información en la consola 
        console.log(`-----------------------------------`);
        console.log(`REPORTE DE SOLICITUD`);
        console.log(`Url:    ${protocol}://${hostname}${originalUrl}`);
        console.log('Fecha: ', fechaLatino);
        console.log('Hora:  ', hora);
        console.log(`Método: ${method}`);
        if (Object.keys(body).length > 0) {
            console.log(`Datos:`);
            if (body.email) console.log('-Email: ', body.email);
            if (body.rol) console.log('-Rol: ', body.rol);
            if (body.lenguage) console.log('-Lenguaje: ', body.email);
        }
        console.log(`-----------------------------------`);
        console.log('Credenciales existen (email y password), puede continuar.')
        next();
    }
}

function validarTokenMiddleware(req, res, next) {
    // Obtener el token de las cabeceras de la solicitud
    const Authorization = req.header("Authorization");

    // Verificar si el token existe
    if (!Authorization) {
        // Si el token no existe, enviar una respuesta de error
        return res.status(401).json({ message: 'Token no proporcionado' });
    }
    try {
        const token = Authorization.split("Bearer ")[1];
        // Verificar y decodificar el token utilizando la clave secreta
        const datosToken = jwt.verify(token, process.env.JWT_SECRET);

        // Guardar los datos del token en la solicitud para usarlos en las rutas
        req.datosToken = datosToken;

        const { method, originalUrl, body, protocol, hostname } = req;
        // Generar timestamp de hoy
        const timestamp = new Date();
        // Obtener la fecha
        const fecha = timestamp.toISOString().slice(0, 10);
        const fechaLatino = fecha.split('-').reverse().join('/');
        // Obtener la hora
        const hora = timestamp.toTimeString().slice(0, 8);

        // Registra la información en la consola 
        console.log(`-----------------------------------`);
        console.log(`REPORTE DE SOLICITUD`);
        console.log(`Url:    ${protocol}://${hostname}${originalUrl}`);
        console.log('Fecha: ', fechaLatino);
        console.log('Hora:  ', hora);
        console.log(`Método: ${method}`);
        if (Object.keys(body).length > 0) {
            console.log(`Datos:`);
            if (body.email) console.log('-Email: ', body.email);
            if (body.rol) console.log('-Rol: ', body.rol);
            if (body.lenguage) console.log('-Lenguaje: ', body.email);
        }
        console.log(`-----------------------------------`);
        // Pasar al siguiente middleware o a la ruta
        console.log('Token proporcionado y validado, puede continuar con el email: ' + datosToken.email);

        next();
    } catch (error) {
        // Si el token no es válido, enviar una respuesta de error
        res.status(401).json({ mensaje: 'Token inválido' });
    }


}

function customReportMiddleware(req, res, next) {
    const { email, password, rol, lenguage } = req.body;

    // Verificar si algún dato no está definido o no tiene datos
    if (!email || !password || !rol || !lenguage) {
        console.log("Datos incompletos, se deben completar todos antes de continuar.")
        return res.status(400).json({ message: 'Datos incompletos' });
    }
    console.log("Se ingresaron todos los datos, se puede continuar. ");
    // Todos los datos están presentes y son válidos
    next();
};

//generar constante que determina el puerto a usar
const PORT = process.env.PORT || 3000;

const { verificarCredenciales, registrarUsuario, obtenerDatosUsuario } = require('./controllers/consultas.js');

app.post("/login", verificarCredencialesMiddleware, async (req, res) => {
    try {
        const { email, password } = req.body;
        await verificarCredenciales(email, password);
        const token = jwt.sign({ email }, process.env.JWT_SECRET);
        res.send(token);
    } catch ({ code, message }) {
        //console.log(error)
        res.status(code || 500).send(message);
    }
});

app.get("/usuarios", validarTokenMiddleware, async (req, res) => {
    try {

        const { email } = req.datosToken
        result = await obtenerDatosUsuario(email);
        //console.log(result);
        res.json(result);

    } catch ({ code, message }) {
        res.status(code || 500).send(message);
    }
});
app.post("/usuarios", customReportMiddleware, async (req, res) => {
    try {
        const usuario = req.body;
        await registrarUsuario(usuario);
        //console.log(row);
        res.status(201).send("Usuario creado con éxito");
    } catch ({ code, message }) {
        console.log( message);
        res.status(code || 500).json(message);
    }
});

app.get("*", (req, res) => {
    res.status(404).send("Esta ruta no existe"); // Ruta para manejar todas las demás rutas no definidas
});

app.listen(PORT, console.log("SERVER ON on port: " + PORT));

