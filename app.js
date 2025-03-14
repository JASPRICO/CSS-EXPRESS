const express = require('express');
const app = express();
const port = 5001;
const path = require('path');


// Get the client
const mysql = require('mysql2/promise');

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
    host: 'mysql-29bf9b16-albe-d062.d.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_tOEB1KfpdTiZG6lXMy0',
    database: 'defaultdb',
    port: 25289,
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
            //enviar a index.html
            res.sendFile(path.join(__dirname, 'cita.html'));
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
        const { email } = req.query;
        const [result] = await pool.query('INSERT INTO usuarios (usuario, clave, email) VALUES (?, ?, ?)', [user, pass, email]);
        if (result.affectedRows > 0) {
            res.send('Usuario registrado');
        } else {
            res.send('Usuario ya registrado');
        }
    } catch (err) {
        res.status(500).send('Error en la consulta');
    }
});

// Ruta de recuperar contraseña
app.get('/recuperar', async (req, res) => {
    try {
        const { user } = req.query;
        const { email } = req.query;
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE usuario = ? AND email = ?', [user, email]);
        if (rows.length > 0) {
            res.send('correo enviado a ' + email);
        } else {
            res.send('correo y/o usuario no encontrado');
        }
    } catch (err) {
        res.status(500).send('Error en la consulta');
    }
});

// Ruta de registro de cita
app.get('/cita', async (req, res) => {
    try {
        const { car } = req.query;
        const { cc } = req.query;
        const { condu } = req.query;
        const { dia } = req.query;
        const { cont } = req.query;
        const [result] = await pool.query('INSERT INTO citas (vehiculo, cedula, conductor, dia, contenedor) VALUES (?, ?, ?, ?, ?)', [car, cc, condu, dia, cont]);
        if (result.affectedRows > 0) {
            res.send('Cita registrada');
        } else {
            res.send('Cita ya registrada');
        }
    } catch (err) { 
        res.status(500).send('Error en la consulta');
    }
});

// consulta de citas
app.get('/consulta', async (req, res) => {
    try {
        const { car } = req.query;
        const { cc } = req.query;

        const [rows] = await pool.query('SELECT * FROM citas WHERE vehiculo = ? AND cedula = ? AND dia = CURDATE()', [car, cc]);
        if (rows.length > 0) {
            res.send('INGRESO AUTORIZADO');
        } else {
            res.send('NO TIENE CITA PARA HOY ' + car);
        }
    } catch (err) {
        res.status(500).send('Error en la consulta');
    }
});



// Escuchar en el puerto 5001
app.listen(5001, () => {
    console.log('Escuchar en el puerto 5001');
});



