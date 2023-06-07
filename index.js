const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require("jsonwebtoken")

app.use(cors())
app.use(express.json())

//generar constante que determina el puerto a usar
const PORT = process.env.PORT || 3000;

const { verificarCredenciales, deleteEvento, registrarUsuario, obtenerDatosUsuario } = require('./consultas.js');

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        await verificarCredenciales(email, password)
        const token = jwt.sign({ email }, "az_AZ")
        res.send(token)
    } catch (error) {
        console.log(error)
        res.status(error.code || 500).send(error)
    }
})

app.delete("/eventos/:id", async (req, res) => {
    try {
        const { id } = req.params
        const Authorization = req.header("Authorization")
        const token = Authorization.split("Bearer ")[1]
        jwt.verify(token, "az_AZ")
        const { email } = jwt.decode(token)
        await deleteEvento(id)
        res.send(`El usuario ${email} ha eliminado el evento de id ${id}`)
    } catch (error) {
        res.status(error.code || 500).send(error)
    }
})

app.get("/usuarios", async (req, res) => {
    try {
        const Authorization = req.header("Authorization")
        const token = Authorization.split("Bearer ")[1]
        jwt.verify(token, "az_AZ")
        const { email } = jwt.decode(token)
        result=await obtenerDatosUsuario(email);
        res.json(result);
    } catch (error) {
        res.status(error.code || 500).send(error)
    }
})
app.post("/usuarios", async (req, res) => {
    try {
        const usuario = req.body
        await registrarUsuario(usuario)
        res.send("Usuario creado con éxito")
    } catch (error) {
        res.status(500).send(error)
    }
})

app.listen(PORT, console.log("SERVER ON on port: " + PORT))

