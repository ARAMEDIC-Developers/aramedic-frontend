const express = require("express");
const router = express.Router();
const conexion = require("../config/conexion");
const link = require("../config/link");
const { validateItem } = require('../validaciones/login');
const { validationResult } = require('express-validator');  



router.get("/login", function(req, res) {
    res.render("login", { link, oldData: {} });
});

router.post("/login", validateItem, function(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Mostrar errores en la vista
        return res.render("login", {
            link,
            errors: errors.array(),
            oldData: req.body
        });
    }

    const DNI = req.body.dni;
    const contrasena = req.body.contra;

    const validar = "SELECT * FROM usuarios WHERE dni = ?";
    conexion.query(validar, [DNI], async function(error, rows) {
        let mensaje;
        if (error) {
            console.log("TRIKA error consulta validar", error);
            return res.status(500).send("TRIKA ERROR EN EL SERVIDOR");
        }
        if (rows.length < 1) {
            mensaje = "El DNI no existe en la base de datos.";
            // Renderizar la vista de login con mensaje de error
            res.render("login", { mensaje, link, oldData: req.body });
        } else {
            const usuario = rows[0]
            const loginQuery = "CALL login_procedure(?, ?)"
            if(usuario.paciente_id){
                conexion.query(loginQuery, [usuario.rol_id, usuario.paciente_id], function(error, result){
                    const paciente = result[0][0];
                    const match = contrasena == usuario.contrasena;
                    if (!match) {
                        // Contraseña incorrecta, mostrar mensaje de error
                        mensaje = "La contraseña ingresada es incorrecta.";
                        res.render("login", { mensaje, link, oldData: req.body });
                    } else {
                        // Inicio de sesión exitoso, crear la sesión del usuario
                        req.session.login = true;
                        req.session.idusu = paciente.id;
                        req.session.dn = paciente.dni;
                        req.session.nom = paciente.nombre;  
                        req.session.tel = paciente.telefono;
                        req.session.cor = paciente.email;
                        req.session.pac = paciente.paciente_id;
                        req.session.contra = paciente.contrasena;
                        req.session.rol = paciente.rol_id;
                        console.log(req.session); // Comprobar los datos de sesión
                        res.redirect("dashboard_paciente");
                    }
                })
            }
            else{
                conexion.query(loginQuery, [usuario.rol_id, usuario.medico_id], async function(error, result){
                    const medico = result[0][0];
                    const match = contrasena == usuario.contrasena;
                    if (!match) {
                        // Contraseña incorrecta, mostrar mensaje de error
                        mensaje = "La contraseña ingresada es incorrecta.";
                        res.render("login", { mensaje, link, oldData: req.body });
                    } else {
                        // Inicio de sesión exitoso, crear la sesión del usuario
                        req.session.login = true;
                        req.session.idusu = medico.id;
                        req.session.dn = medico.dni;
                        req.session.nom = medico.nombre;  
                        req.session.tel = medico.telefono;
                        req.session.cor = medico.email;
                        req.session.med = medico.medico_id;
                        req.session.contra = medico.contrasena;
                        req.session.rol = medico.rol_id;
                        console.log(req.session); // Comprobar los datos de sesión
                        res.redirect("dashboard_jmedico");
                    }
                })
            }
        }
    });
});

router.get("/logout", function(req, res) {
    req.session.destroy();
    res.redirect("/login");
});
module.exports = router;