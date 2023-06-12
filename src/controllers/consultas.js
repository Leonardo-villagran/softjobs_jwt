const { Pool } = require('pg');
require('dotenv').config();
const bcrypt = require('bcryptjs')

//Conexión a la base de datos
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    allowExitOnIdle: true
});

const verificarCredenciales = async (email, password) => {
        
    let usuario;
    let rowCount;

    //Verificar que el email y password están en la base de datos
    const values = [email];
    const consulta = "SELECT * FROM usuarios WHERE email = $1";

    //Realizar consulta a la base de datos y verificar si hay conexión
    try {
        const result = await pool.query(consulta, values);
        usuario = result.rows[0];
        rowCount = result.rowCount;

    } catch (error) {
        throw { code: 500, message: "Hay un error interno en el sistema." };
    }

    //Verificar si el usuario existe en la base de datos
    if (!usuario || !usuario.password) {
        throw { code: 401, message: "Usuario no existe" };
    }

    //Obtener la password encriptada desde la base de datos
    const { password: passwordEncriptada } = usuario;
    //Encriptar la password antes de realizar la comparación
    const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada);

    //Verificar que la password coincide con la que se encuentra en la base de datos
    if (!passwordEsCorrecta || !rowCount) {
        throw { code: 401, message: "Email o contraseña incorrecta" };
    }

};

const obtenerDatosUsuario = async (email) => {
    try {

        //Seleccionar los datos del usuario desde la base de datos
        const consulta = "SELECT email, rol, lenguage FROM usuarios WHERE email=$1";
        const values = [email];
        const { rowCount, rows } = await pool.query(consulta, values)
        if (!rowCount)
            throw { code: 404, message: "No se encontró ningún usuario con ese email." }
        return rows[0];
    } catch (error) {
        throw { code: error.code || 500, message: "Hay un error interno en el sistema." };
    }
}

const registrarUsuario = async (usuario) => {
    try {
        const { email, password, rol, lenguage } = usuario;

        // Verificar si el email ya está registrado
        const emailExistente = await pool.query("SELECT email FROM usuarios WHERE email = $1", [email]);
        if (emailExistente.rows.length > 0) {
            throw { code: 400, message: "El email ya está registrado" };
        }
        // Encriptar la password antes de registrar al usuario en la base de datos
        const passwordEncriptada = bcrypt.hashSync(password);
        const values = [email, passwordEncriptada, rol, lenguage];
        //Insertar nuevo usuario en la base de datos. 
        const consulta = "INSERT INTO usuarios (email, password, rol, lenguage) values($1,$2,$3,$4) RETURNING *";
        const result = await pool.query(consulta, values);
        return result.rows[0];
    } catch (error) {
        throw { code: error.code || 500, message: "Hay un error interno en el sistema." };
    }
}

module.exports = { verificarCredenciales, registrarUsuario, obtenerDatosUsuario };