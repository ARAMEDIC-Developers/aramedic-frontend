const express = require("express");
const router= express.Router();
const Conexion = require("../config/connection");
const link= require("../config/link");
const { validateCreate } = require('../validaciones/registroU');
const { validationResult } = require('express-validator');
const { NULL } = require("mysql/lib/protocol/constants/types");

const conec = new Conexion();

// Mostrar el formulario de registro
router.get("/registroU", function(req, res) {
    res.render("registro", { 
        link, 
        errors: [], // No hay errores en la primera carga
        oldData: {} // En la primera carga no hay datos previos
    });
});

// Procesar el formulario de registro
router.post("/registroU", validateCreate, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Si hay errores, renderizamos la vista 'registro' con los errores y datos anteriores
        return res.render("registro", { 
            link, 
            errors: errors.array(), // Enviamos los errores a la vista
            oldData: req.body // Enviamos los datos ingresados para que se mantengan
        });
    }

    let connection = null;
    try{

        connection = await conec.beginTransaction();

        const { nom, ape, ema, num, dni, fecha, contra, confirm_contra, dire } = req.body;
        const idrolPaciente =1;

        const  verificarUsuario = await conec.execute(connection, 'SELECT * FROM usuarios WHERE dni = ?', [
            dni
        ]);

        if(verificarUsuario.length !== 0){
            const mensajesError = [];
            mensajesError.push({ msg: "El DNI ya está registrado" });

            return res.render("registro", {
                link,
                errors: mensajesError,
                oldData: req.body
            });
        }

        const result = await conec.execute(connection, `
            INSERT INTO pacientes (nombre, apellido, fecha_nacimiento, telefono, email, direccion) VALUES (?, ?, ?, ?, ?, ?)`, [
                nom,
                ape, 
                fecha,
                num,
                ema, 
                dire
            ]);

            await conec.execute(connection, `
                INSERT INTO usuarios (dni, contrasena, rol_id, paciente_id) VALUES (?, ?, ?, ?)`, [
                    dni, 
                    contra, 
                    idrolPaciente, 
                    result.insertId
                ]);        

        await conec.commit(connection);
        res.redirect(link + "login");
    }catch(error){
        if (connection != null) {
            await conec.rollback(connection);
        }
        console.log(error)
        const mensajesError = [];
            mensajesError.push({ msg: "Error en el servidor" });

            return res.render("registro", {
                link,
                errors: mensajesError,
                oldData: req.body
            });
    }
});

// Ruta para registrar cita
router.post("/registro-cita",async (req, res) =>{
    let connection = null;
    try {
        connection = await conec.beginTransaction();

        await conec.execute(connection, `
            INSERT INTO citas(
            paciente_id, 
            medico_id, 
            servicio_id,
            fecha,
            hora,
            estado) 
            VALUES (?,?,?,?,?,?)`, Object.values(req.body));

        await conec.commit(connection);

        res.status(201).send("prabando ruta");
    } catch (error) {
        if (connection != null) {
            await conec.rollback(connection);
        }
        console.log(error)
        return res.status(500).send("error en registrar")
    }
   
});

module.exports = router;
