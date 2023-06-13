const pool = require('../config/database'); 

const databaseMiddleware = async (req, res, next) => {
    
    try {
        const client = await pool.connect();
        client.release();
        console.log(`* Existe conexión a la base de datos, puede continuar.`);
        next();
    } catch (err) {
        console.error('* Error al conectar a la base de datos.');
        return res.status(500).send('Error al conectar a la base de datos.');
    }
}

module.exports = databaseMiddleware;