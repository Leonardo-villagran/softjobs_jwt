const jwt = require("jsonwebtoken")
require('dotenv').config();

function VerificarCredencialesM(req, res, next) {
    // Verificar si no existen el email, el password o el token en la solicitud
    if (!req.body.email || !req.body.password) {
        // Si alguna de las credenciales no existe, enviar una respuesta de error
        console.log("Credenciales incompletas debe ingresar el email y password.");
        res.status(401).json({ message: 'Credenciales incompletas debe ingresar el email y password.' });
    } else {
        // Si todas las credenciales existen, pasar al siguiente middleware o a la ruta
        console.log('Credenciales existen (email y password), puede continuar.')
        next();
    }
}

function ValidarTokenM(req, res, next) {
    // Obtener el token de las cabeceras de la solicitud
    const Authorization = req.header("Authorization");

    // Verificar si el token existe
    if (!Authorization) {
        // Si el token no existe, enviar una respuesta de error
        console.log("Token no proporcionado.");
        return res.status(401).json({ message: 'Token no proporcionado.' });
    }
    try {
        const token = Authorization.split("Bearer ")[1];
        // Verificar y decodificar el token utilizando la clave secreta
        const datosToken = jwt.verify(token, process.env.JWT_SECRET);

        // Guardar los datos del token en la solicitud para usarlos en las rutas
        req.datosToken = datosToken;

        // Pasar al siguiente middleware o a la ruta
        console.log('Token proporcionado y validado, puede continuar con el email: ' + datosToken.email);

        next();
    } catch (error) {
        // Si el token no es válido, enviar una respuesta de error
        console.log("Token inválido.");
        res.status(401).json({ mensaje: 'Token inválido.' });
    }
}

function VerificarDataM(req, res, next) {
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

module.exports = {  VerificarCredencialesM,ValidarTokenM, VerificarDataM };