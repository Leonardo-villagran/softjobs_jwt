const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require("jsonwebtoken")
require('dotenv').config();

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
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
    if (Object.keys(body).length > 0) console.log('Datos:', body);
    console.log(`-----------------------------------`);
    next();
});

//generar constante que determina el puerto a usar
const PORT = process.env.PORT || 3000;

const { verificarCredenciales, registrarUsuario, obtenerDatosUsuario } = require('./controllers/consultas.js');

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        await verificarCredenciales(email, password)
        const token = jwt.sign({ email }, "az_AZ")
        res.send(token)
    } catch (error) {
        console.log(error)
        res.status(error.code || 500).send(error.message)
    }
})

app.get("/usuarios", async (req, res) => {
    try {
        const Authorization = req.header("Authorization")
        const token = Authorization.split("Bearer ")[1]
        jwt.verify(token, "az_AZ")
        const { email } = jwt.decode(token)
        result = await obtenerDatosUsuario(email);
        console.log(result);
        res.json(result);
        
    } catch (error) {
        res.status(500).send(error)
    }
})
app.post("/usuarios", async (req, res) => {
    try {
        const usuario = req.body;
        const row = await registrarUsuario(usuario);
        //console.log(row);
        res.status(201).send("Usuario creado con éxito");
    } catch (error) {
        console.error(error);
        res.status(500).send(error)
    }
})

app.listen(PORT, console.log("SERVER ON on port: " + PORT))

