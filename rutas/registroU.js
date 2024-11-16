const express = require("express");
const router= express.Router();
const conexion=require("../config/conexion");
const link= require("../config/link");
const { validateCreate } = require('../validaciones/registroU');
const { validationResult } = require('express-validator');

// Mostrar el formulario de registro
router.get("/registroU", function(req, res) {
    res.render("registro", { 
        link, 
        errors: [], // No hay errores en la primera carga
        oldData: {} // En la primera carga no hay datos previos
    });
});

// Procesar el formulario de registro
router.post("/registroU", validateCreate, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Si hay errores, renderizamos la vista 'registro' con los errores y datos anteriores
        return res.render("registro", { 
            link, 
            errors: errors.array(), // Enviamos los errores a la vista
            oldData: req.body // Enviamos los datos ingresados para que se mantengan
        });
    }

    const { nom, ape, ema, num, dni, fecha, contra, confirm_contra, dire } = req.body;
    const idrolPaciente =1;

    // Verificar si el DNI, correo o número de celular ya existen
    const verificarUsuario = "SELECT * FROM usuarios WHERE dni = ?";
    conexion.query(verificarUsuario, [dni], (error, rows) => {
        if (error) {
            console.log("TRIKA error en la consulta de verificación", error);
            return res.status(500).send("TRIKA ERROR EN EL SERVIDOR");
        }

        if (rows.length > 0) {
            // Si ya existe un usuario con el DNI
            const mensajesError = [];
            if (rows.some(row => row.dni === dni)) mensajesError.push({ msg: "El DNI ya está registrado" });

            return res.render("registro", {
                link,
                errors: mensajesError,
                oldData: req.body
            });
        }

        // Si no hay errores, insertar el nuevo usuario en la base de datos
        const insertarPaciente = "INSERT INTO pacientes (nombre, apellido, fecha_nacimiento, telefono, email, direccion) VALUES (?, ?, ?, ?, ?, ?)";
        conexion.query(insertarPaciente, [nom, ape, fecha, num, ema, dire], (error, result) => {
            if (error) {
                console.log("TRIKA error al insertar paciente", error);
                return res.status(500).send("Error al registrar el paciente");
            }

            const pac_id = result.insertId;  // Aquí obtenemos el ID del paciente insertado
            const insertarUsuario = "INSERT INTO usuarios (dni, contrasena, rol_id, paciente_id) VALUES (?, ?, ?, ?)";
            conexion.query(insertarUsuario, [dni, contra, idrolPaciente, pac_id], (error, result) => {
                if (error) {
                    console.log("TRIKA error al insertar usuario", error);
                    return res.status(500).send("Error al registrar el usuario");
                }
            console.log("TRIKA datos almacenados correctamente");
            res.redirect(link + "login");
            });
        });
        /*/
        const obteneridUser='SELECT idusuario FROM `usuario` WHERE DNI = ?';
        conexion.query(obteneridUser, dni, (error, rows)=>{
            if(error){
                console.log(error)
            }
            else{
                const iduser = rows[0].idusuario;
                const procedure='CALL create_medical_history(?, ?, ?, ?, ?, ?)';
                conexion.query(procedure, [iduser, nom, ape, num, genderBool, ema], function(error){
                    if(error){
                        console.log(error)
                    }
                    else{
                        console.log('TRIKA AGREGADO HISTORIA')
                    }
                })
            }
        });
        /*/
    });
});
module.exports = router;