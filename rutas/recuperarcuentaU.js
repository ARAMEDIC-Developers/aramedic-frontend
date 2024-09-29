const express = require("express");
const router= express.Router();
const conexion=require("../config/conexion");
const link= require("../config/link");
//const { validateCreate } = require('../validaciones/recuperarCuenta');
const { validationResult } = require('express-validator');

//MOSTRAR FORMULARIO DE RECUPERAR CUENTA
router.get("/recuperarcuentaU", function(req, res) {
    res.render("recuperarcuenta", { link, oldData: {} });
});

router.post("/recuperarcuentaU", function(req, res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Mostrar errores en la vista (EN CASO SEA NECESARIO)
        return res.render("recuperarcuenta", {
            link,
            errors: errors.array(),
            oldData: req.body
        });
    }
    const ema = req.body.email;
    const validar="SELECT * FROM usuario WHERE correo = ?";
    conexion.query(validar,[ema],async function(error,rows){
        //let mensaje;
        if (rows.length<1) {
            console.log("TRIKA error consulta validar",error);
            res.status(404).send("USUARIO CON EMAIL NO ENCONTRADO");
        }
        else{
            res.send("USUARIO ENCONTRADO");
        }
    })
})
module.exports = router;