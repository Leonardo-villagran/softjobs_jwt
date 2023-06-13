const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require("jsonwebtoken")
require('dotenv').config();

//Ruta a las funciones controladoras
const { verificarCredenciales, registrarUsuario, obtenerDatosUsuario } = require('./controllers/controllers');
//Ruta a los middleware
const { VerificarCredencialesM,ValidarTokenM, VerificarDataM } = require('./middleware/middlewares');
const reportMiddleware  = require('./middleware/report');
const databaseMiddleware = require('./middleware/databasereport');

app.use(cors());
app.use(express.json());

//Middleware que determina determina si hay conexión a la base de datos y entrega un reporte de solicitudes.
app.use(reportMiddleware);
app.use(databaseMiddleware);

app.post("/login", VerificarCredencialesM, async (req, res) => {
    try {
        const { email, password } = req.body;
        await verificarCredenciales(email, password);
        const token = jwt.sign({ email }, process.env.JWT_SECRET);
        console.log("Token generado para usuario: ",email);
        res.send(token);
    } catch ({ code, message }) {
        console.log(message);
        res.status(code || 500).send(message);
    }
});

app.get("/usuarios", ValidarTokenM, async (req, res) => {
    try {

        const { email } = req.datosToken
        result = await obtenerDatosUsuario(email);
        console.log("Datos de usuario enviados. Datos: ", result);
        res.json(result);

    } catch ({ code, message }) {
        console.log(message);
        res.status(code || 500).send(message);
    }
});

app.post("/usuarios",VerificarDataM, async (req, res) => {
    try {
        const usuario = req.body;
        await registrarUsuario(usuario);
        //console.log(row);
        res.status(201).send("Usuario creado con éxito");
    } catch ({ code, message }) {
        console.log(message);
        res.status(code || 500).json(message);
    }
});

app.get("*", (req, res) => {
    console.log("Esta ruta no existe.");
    res.status(404).send("Esta ruta no existe."); // Ruta para manejar todas las demás rutas no definidas
});

//generar constante que determina el puerto a usar
const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log("Servidor en puerto: " + PORT));

