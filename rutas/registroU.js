const express = require("express");
const router= express.Router();
const conexion=require("../config/conexion");
const link= require("../config/link");
const { validateCreate } = require('../validaciones/registroU');
const { validationResult } = require('express-validator');
const { NULL } = require("mysql/lib/protocol/constants/types");

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

    const { nom, ape, ema, num, dni, contra, confirm_contra, gender } = req.body;
    let genderBool;
    const idrolPaciente =1;
    switch(gender){
        case 'Masculino':
            genderBool=0;
            break;
        case 'Femenino':
            genderBool=1;
            break;
        default:
            genderBool=2;
            break;
    }

    // Verificar si el DNI, correo o número de celular ya existen
    const verificarUsuario = "SELECT * FROM usuario WHERE dni = ? OR correo = ? OR num_telefonico = ?";
    conexion.query(verificarUsuario, [dni, ema, num], (error, rows) => {
        if (error) {
            console.log("TRIKA error en la consulta de verificación", error);
            return res.status(500).send("TRIKA ERROR EN EL SERVIDOR");
        }

        if (rows.length > 0) {
            // Si ya existe un usuario con el DNI, correo o número de celular
            const mensajesError = [];
            if (rows.some(row => row.dni === dni)) mensajesError.push({ msg: "El DNI ya está registrado" });
            if (rows.some(row => row.correo === ema)) mensajesError.push({ msg: "El correo electrónico ya está registrado" });
            if (rows.some(row => row.num_telefonico === num)) mensajesError.push({ msg: "El número de teléfono ya está registrado" });

            return res.render("registro", {
                link,
                errors: mensajesError,
                oldData: req.body
            });
        }

        // Si no hay errores, insertar el nuevo usuario en la base de datos
        const insertar="INSERT INTO usuario (DNI,nombres,apellidos,num_telefonico,genero,correo,contrasena,idrol) VALUES ('"+dni+"','"+nom+"','"+ape+"','"+num+"','"+genderBool+"','"+ema+"','"+contra+"','"+idrolPaciente+"')";
        conexion.query(insertar,function(error){
            if (error) {
                console.log("TRIKA error");
                throw error;
            } else {
                console.log("TRIKA datos almacenados correctamente");
                res.redirect(link+"login");
            }
        });
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
    });
});
module.exports = router;