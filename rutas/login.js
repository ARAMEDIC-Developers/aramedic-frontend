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
            res.render("login", { mensaje, link, oldData: req.body });
        } else {
            const usuario = rows[0]
            const loginQuery = "CALL login_procedure(?, ?)"
            function manejarInicioSesion(res, req, usuario, datos, dashboard, idKey) {
                const match = contrasena === usuario.contrasena;
                if (!match) {
                    const mensaje = "La contraseña ingresada es incorrecta.";
                    return res.render("login", { mensaje, link, oldData: req.body });
                }
                // Configurar la sesión
                req.session.login = true;
                req.session.idusu = usuario.id;
                req.session.dni = usuario.dni;
                req.session.nom = datos.nombre;
                req.session.tel = datos.telefono;
                req.session.cor = datos.email;
                req.session.contra = usuario.contrasena;
                req.session.rol = usuario.rol_id;
                req.session[idKey] = datos[idKey]; // ID DEL MEDICO O PACIENTE
                res.redirect(dashboard);
            }
            function procesarLoginPorRol(res, req, usuario) {
                conexion.query(loginQuery, [usuario.rol_id, usuario.id], function (error, result) {
                    if (error) {
                        console.error("Error en la consulta:", error);
                        const mensaje = "Error interno. Intente más tarde.";
                        return res.render("login", { mensaje, link, oldData: req.body });
                    }
                    const datos = result[0][0];
                    if (usuario.rol_id === 1) {
                        manejarInicioSesion(res, req, usuario, datos, "dashboard_paciente", "paciente_id");
                    } else if (usuario.rol_id === 2) {
                        manejarInicioSesion(res, req, usuario, datos, "dashboard_jmedico", "medico_id");
                    } else {
                        //ROL ADMIN
                    }
                });
            }
            const user = rows[0];
            if (user) {
                procesarLoginPorRol(res, req, user);
            } else {
                const mensaje = "Usuario no encontrado.";
                res.render("login", { mensaje, link, oldData: req.body });
            }
        }
    });
});

router.get("/logout", function(req, res) {
    req.session.destroy();
    res.redirect("/login");
});
module.exports = router;
