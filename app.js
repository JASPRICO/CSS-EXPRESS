const express = require('express');
const app = express();
const port = 5000;

// Get the client
const mysql = require('mysql2/promise');

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'xexpress',
});

// Middleware to parse JSON request bodies
app.use(express.json());

// Ruta de login
app.get('/login', async (req, res) => {
    try {
        const { user } = req.query;
        const { pass } = req.query;
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE usuario = ? AND clave = ?', [user, pass]);
        if (rows.length > 0) {
            res.send('Usuario valido');
        } else {
            res.send('Usuario no valido');
        }
    } catch (err) {
        res.status(500).send('Error en la consulta');
    }
});

// Ruta de registro
app.get('/regist', async (req, res) => {
    try {
        const { user } = req.query;
        const { pass } = req.query;
        const [result] = await pool.query('INSERT INTO usuarios (usuario, clave) VALUES (?, ?)', [user, pass]);
        if (result.affectedRows > 0) {
            res.send('Usuario registrado');
        } else {
            res.send('Usuario ya registrado');
        }
    } catch (err) {
        res.status(500).send('Error en la consulta');
    }
});

// Escuchar en el puerto 5000
app.listen(5000, () => {
    console.log('Servidor corriendo en http://localhost:5000');
});



