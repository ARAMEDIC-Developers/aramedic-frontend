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
            const user = rows[0];
            const match = contrasena == user.contrasena;

            if (!match) {
                // Contraseña incorrecta, mostrar mensaje de error
                mensaje = "La contraseña ingresada es incorrecta.";
                res.render("login", { mensaje, link, oldData: req.body });
            } else {
                // Inicio de sesión exitoso, crear la sesión del usuario
                req.session.login = true;
                req.session.idusu = user.id;
                req.session.dn = user.dni;
                req.session.nom = user.nombre_usuario;
                req.session.tel = user.num_telefonico;
                req.session.cor = user.correo;
                req.session.contra = user.contrasena;
                req.session.rol = user.rol_id;
                console.log(req.session); // Comprobar los datos de sesión

                // Redirigir según el rol del usuario
                if (user.rol_id == 1) {
                    res.redirect("dashboard_paciente");
                } else if (user.rol_id == 2) {
                    res.redirect("dashboard_jmedico");
                }
            }
        }
    });
});

router.get("/logout", function(req, res) {
    req.session.destroy();
    res.redirect("/login");
});

module.exports = router;
