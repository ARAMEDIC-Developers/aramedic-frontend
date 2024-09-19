const express = require("express");
const router= express.Router();
const conexion=require("../config/conexion");
const link= require("../config/link");
const { validateCreate } = require('../validaciones/registroU');
const { validationResult } = require('express-validator');



router.get("/registroU", function(req, res) {
    res.render("registro", { 
        link, 
        errors: [], // No hay errores en la primera carga
        oldData: {} // En la primera carga no hay datos previos
    });
});

router.post("/registroU", validateCreate, function(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Si hay errores, renderizamos la vista 'registro' con los errores y datos anteriores
        return res.render("registro", { 
            link, 
            errors: errors.array(), // Enviamos los errores a la vista
            oldData: req.body // Enviamos los datos ingresados para que se mantengan
        });
    }

    //validaciones entre la linea 14 y 20
    let nombres=req.body.nom;
    let apellidos=req.body.ape;
    let email=req.body.ema;
    let contrasena=req.body.contra;
    let DNI=req.body.dni;
    let genero=req.body.gender;
    let numero_telefonico = req.body.num;

    const idrolPaciente = 1;

    const insertar="INSERT INTO usuario (DNI,nombres,apellidos,num_telefonico,genero,correo,contrasena,idrol) VALUES ('"+DNI+"','"+nombres+"','"+apellidos+"','"+numero_telefonico+"','"+genero+"','"+email+"','"+contrasena+"','"+idrolPaciente+"')";
                conexion.query(insertar,function(error){
                    if (error) {
                        console.log("TRIKA error");
                        throw error;
                    } else {
                        console.log("TRIKA datos almacenados correctamente");
                        res.redirect(link+"login");
                    }
                });

});

module.exports=router;

