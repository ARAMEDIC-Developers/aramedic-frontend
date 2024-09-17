const express = require('express');
const router = express.Router();

const mysqlConnection = require('../config/conexion');

//GET ALL
router.get('/', (req, res) => {
    mysqlConnection.query('SELECT * FROM usuario', (err, rows, fileds) => {
        if(!err){
            res.json(rows);
        }
        else{
            console.log(err);
        }
    });
});

//GET BY ID
router.get('/:id', (req,res) => {
    const {id} = req.params;
    mysqlConnection.query('SELECT * FROM usuario WHERE IDusuario = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json(rows);
        }
        else{
            console.logs(err);
        }
    })
})

//POST
router.post('/', (req, res) =>{
    const {IDusuario, DNI, Nombres, Apellidos, Rol, Fecha_nacimiento, Num_telefonico, Genero } = req.body;
    console.log(req.body);
    const query = `
        INSERT INTO usuario(IDusuario, DNI, Nombres, Apellidos, Rol, Fecha_nacimiento, Num_telefonico, Genero)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    mysqlConnection.query(query, [IDusuario, DNI, Nombres, Apellidos, Rol, Fecha_nacimiento, Num_telefonico, Genero], (err, rows, fields) =>{
        if(!err){
            res.json({Status: 'Usuario añadido'});
        }
        else{
            console.log(err);
        }
    })
})

module.exports = router;