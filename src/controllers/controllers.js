require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../config/database'); 

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
        throw { code: 401, message: "Usuario no existe en el sistema." };
    }

    //Obtener la password encriptada desde la base de datos
    const { password: passwordEncriptada } = usuario;
    //Encriptar la password antes de realizar la comparación
    const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada);

    //Verificar que la password coincide con la que se encuentra en la base de datos
    if (!passwordEsCorrecta || !rowCount) {
        throw { code: 401, message: "Email o contraseña incorrecta." };
    }

};

const obtenerDatosUsuario = async (email) => {
    try {

        //Seleccionar los datos del usuario desde la base de datos
        const consulta = "SELECT email, rol, lenguage FROM usuarios WHERE email=$1";
        const values = [email];
        const { rowCount, rows } = await pool.query(consulta, values)
        if (!rowCount) throw { code: 404, message: "No se encontró ningún usuario con ese email." }
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
        //console.log(emailExistente.rows.length)
        if (emailExistente.rows.length > 0) {
            
            throw { code: 400, message: "El email ya está registrado." };
        } else {
            // Encriptar la password antes de registrar al usuario en la base de datos
            const passwordEncriptada = bcrypt.hashSync(password);
            const values = [email, passwordEncriptada, rol, lenguage];
            //Insertar nuevo usuario en la base de datos. 
            const consulta = "INSERT INTO usuarios (email, password, rol, lenguage) values($1,$2,$3,$4) RETURNING *";
            const result = await pool.query(consulta, values);
            console.log("Usuario creado con éxito.")
            return result.rows[0];
        }

    } catch (error) {
        if (error.code) {
            // Si el error tiene un código definido, se lanza tal cual
            throw error;
        } else {
            // Si el error es genérico, se lanza con el código 500
            console.log("Hay un error interno en el sistema.");
            throw { code: 500, message: "Hay un error interno en el sistema." };
        }
    }
}

module.exports = { verificarCredenciales, registrarUsuario, obtenerDatosUsuario };