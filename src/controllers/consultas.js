const { Pool } = require('pg');
require('dotenv').config();
const bcrypt = require('bcryptjs')

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    allowExitOnIdle: true
});

const verificarCredenciales = async (email, password) => {
    const values = [email]
    const consulta = "SELECT * FROM usuarios WHERE email = $1"
    const { rows: [usuario], rowCount } = await pool.query(consulta, values)
    if (!usuario || !usuario.password) {
        throw { code: 401, message: "Usuario no existe" };
    }
    const { password: passwordEncriptada } = usuario;
    const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada);

    if (!passwordEsCorrecta || !rowCount) {
        throw { code: 401, message: "Email o contraseña incorrecta" };
    }
};

const obtenerDatosUsuario = async (email) => {
    try {
        const consulta = "SELECT email, rol, lenguage FROM usuarios WHERE email=$1";
        const values = [email];
        const { rowCount, rows } = await pool.query(consulta, values)
        if (!rowCount)
            throw { code: 404, message: "No se encontró ningún usuario con ese email." }
        return rows[0];
    } catch (error) {
        throw { code: error.code || 500, message: error.message };
    }
}

const registrarUsuario = async (usuario) => {
    try {
        const { email, password, rol, lenguage } = usuario;
        const passwordEncriptada = bcrypt.hashSync(password);
        const values = [email, passwordEncriptada, rol, lenguage];
        const consulta = "INSERT INTO usuarios (email, password, rol, lenguage) values($1,$2,$3,$4) RETURNING *";
        const result = await pool.query(consulta, values);
        return result.rows[0];
    } catch (error) {
        throw { code: error.code || 500, message: error.message };
    }
}

module.exports = { verificarCredenciales, registrarUsuario, obtenerDatosUsuario };