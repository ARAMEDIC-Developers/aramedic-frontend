const express = require("express");
const router= express.Router();
const conexion=require("../config/conexion");
const link= require("../config/link");
const { validateItem } = require('../validaciones/login');
const { validationResult } = require('express-validator');  

router.get("/login",function(req,res){
    res.render("login", { link, oldData: {} });
});

router.post("/login",validateItem,function(req,res){
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Mostrar errores en la vista
        return res.render("login", {
            link,
            errors: errors.array(),
            oldData: req.body
        });
    }

    const DNI= req.body.dni;
    const contrasena= req.body.contra;

    const validar="SELECT * FROM usuario WHERE dni = ? ";
    conexion.query(validar,[DNI],async function(error,rows){
        let mensaje;
        if (error) {
            console.log("TRIKA error consulta validar",error);
            return res.status(500).send("TRIKA ERROR EN EL SERVIDOR");
        }
        if (rows.length<1) {
            mensaje="TRIKA el dni no existe";
            res.render(mensaje,link);
            // return res.render("login", {
            //     link,
            //     mensaje: mensaje,
            //     oldData: req.body
            // });
        }  else {
            const user=rows[0];
            const match= contrasena==user.contrasena;

            if(!match){
                mensaje="TRIKA contraseña incorrecta";
                res.render(mensaje,link);
                // return res.render("login", {
                //     link,
                //     mensaje: mensaje,
                //     oldData: req.body
                // });

            }else{
                req.session.login=true;
                req.session.idusu=user.idusuario;
                req.session.dn=user.dni;
                req.session.nom=user.nombres;
                req.session.ape=user.apellidos;
                req.session.naci=user.fecha_nacimiento;
                req.session.tel=user.num_telefonico;
                req.session.gen=user.genero;
                req.session.cor=user.correo;
                req.session.contra=user.contrasena;
                req.session.rol=user.idrol;
                console.log(req.session);//comprobar los datos que inician sesion

                if (user.idrol == 1) {
                    res.redirect("dashboard_paciente");//{datos:req.session,link}
                } else if (user.idrol == 2) {
                    res.redirect("dashboard_jmedico");//{datos:req.session,link}
                }
                
            }
        }
    });

});

router.get("/logout", function(req,res) {
    req.session.destroy();
    res.redirect("/login");
});


module.exports= router;