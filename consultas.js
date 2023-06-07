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
    const { password: passwordEncriptada } = usuario
    const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada)
    if (!passwordEsCorrecta || !rowCount)
        throw { code: 401, message: "Email o contraseña incorrecta" }
}


const deleteEvento = async (id) => {
    const consulta = "DELETE FROM usuarios WHERE id = $1";
    const values = [id]
    const { rowCount } = await pool.query(consulta, values)
    if (!rowCount)
        throw { code: 404, message: "No se encontró ningún usuario con estas credenciales" }
}
const obtenerDatosUsuario = async (email) =>{
    const consulta = "SELECT email, rol, lenguage FROM usuarios WHERE email=$1";
    const values = [email];
    const { rowCount, rows } = await pool.query(consulta, values)
    if (!rowCount)
        throw { code: 404, message: "No se encontró ningún usuario con ese email." }
    return rows[0];
}

const registrarUsuario = async (usuario) => {
    const { email, password, rol, lenguage } = usuario;
    const passwordEncriptada = bcrypt.hashSync(password);
    const values = [email, passwordEncriptada, rol, lenguage];
    const consulta = "INSERT INTO usuarios (email, password, rol, lenguage) values($1,$2,$3,$4)";
    const result= await pool.query(consulta, values);
}

module.exports = { deleteEvento, verificarCredenciales, registrarUsuario ,obtenerDatosUsuario};