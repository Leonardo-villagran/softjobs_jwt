const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require("jsonwebtoken")
require('dotenv').config();

app.use(cors())
app.use(express.json())

function customReportMiddleware(req, res, next) {
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
    if (Object.keys(body).length > 0){
        console.log(`Datos:`);
        if (body.email) console.log('-Email: ',body.email);
        if (body.rol) console.log('-Rol: ',body.rol);
        if (body.lenguage) console.log('-Lenguaje: ',body.email);
    }
    console.log(`-----------------------------------`);
    next();
};

//generar constante que determina el puerto a usar
const PORT = process.env.PORT || 3000;

const { verificarCredenciales, registrarUsuario, obtenerDatosUsuario } = require('./controllers/consultas.js');

app.post("/login", customReportMiddleware,async (req, res) => {
    try {
        const { email, password } = req.body
        await verificarCredenciales(email, password)
        const token = jwt.sign({email}, process.env.JWT_SECRET)
        res.send(token)
    } catch ({ code, message }) {
        //console.log(error)
        res.status(code || 500).send(message)
    }
})

app.get("/usuarios", customReportMiddleware,async (req, res) => {
    try {
        const Authorization = req.header("Authorization");
        const token = Authorization.split("Bearer ")[1];
        jwt.verify(token, process.env.JWT_SECRET);
        const { email } = jwt.decode(token);
        result = await obtenerDatosUsuario(email);
        //console.log(result);
        res.json(result);
        
    } catch ({ code, message }) {
        res.status(code || 500).send(message);
    }
})
app.post("/usuarios", customReportMiddleware, async (req, res) => {
    try {
        const usuario = req.body;
        const row = await registrarUsuario(usuario);
        //console.log(row);
        res.status(201).send("Usuario creado con éxito");
    } catch ({ code, message }) {
        res.status(code || 500).send(message);
    }
})

app.get("*", customReportMiddleware, (req, res) => {
    res.status(404).send("Esta ruta no existe"); // Ruta para manejar todas las demás rutas no definidas
});

app.listen(PORT, console.log("SERVER ON on port: " + PORT))

