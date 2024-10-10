const express = require("express");
const router = express.Router();
const conexion = require("../config/conexion");
const link = require("../config/link");
const { validateForgotPassword } = require('../validaciones/olvidar_contraseña');
const { validationResult } = require('express-validator');

// Mostrar el formulario de "Olvidar Contraseña"
router.get("/forgot-password", function(req, res) {
    res.render("forgotPassword", { 
        link, 
        errors: [],  // Sin errores al cargar por primera vez
        oldData: {}  // Sin datos previos en la primera carga
    });
});

// Procesar el formulario de "Olvidar Contraseña"
router.post("/forgot-password", validateForgotPassword, function(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Si hay errores, renderizamos la vista con los errores
        return res.render("forgotPassword", { 
            link, 
            errors: errors.array(), // Enviamos los errores a la vista
            oldData: req.body  // Los datos ingresados se mantienen
        });
    }

    const { email } = req.body;

    // Verificar si el correo existe en la base de datos
    const verificarEmail = "SELECT * FROM usuario WHERE correo = ?";
    conexion.query(verificarEmail, [email], function(error, rows) {
        if (error) {
            console.log("Error en la consulta de verificación de correo", error);
            return res.status(500).send("ERROR EN EL SERVIDOR");
        }

        if (rows.length === 0) {
            // Si el correo no está registrado
            return res.render("forgotPassword", {
                link,
                errors: [{ msg: "El correo no está registrado" }],
                oldData: req.body
            });
        }

        // Aquí iría la lógica para enviar un enlace de restablecimiento de contraseña al correo
        console.log("Enlace de restablecimiento enviado al correo");
        res.send("Enlace de restablecimiento enviado al correo.");
    });
});

module.exports = router;
