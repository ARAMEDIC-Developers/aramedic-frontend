const express = require("express");
const router = express.Router();
const conexion = require("../config/conexion");
const { validateCreate } = require('../validaciones/registroU'); // Asegúrate de que este archivo de validación sea correcto
const { validationResult } = require('express-validator');

// Mostrar el formulario de edición de perfil
router.get("/editarPerfil", function(req, res) {
    const userId = req.session.userId; // Obtener ID del usuario desde la sesión

    const consultaUsuario = "SELECT * FROM usuario WHERE id = ?";
    conexion.query(consultaUsuario, [userId], (error, rows) => {
        if (error) {
            console.log("Error en la consulta de edición de perfil", error);
            return res.status(500).send("Error en el servidor");
        }

        if (rows.length > 0) {
            res.render("editarPerfil", { 
                user: rows[0], 
                errors: []
            });
        } else {
            res.redirect("/dashboard_jmedico/login");
        }
    });
});

// Procesar el formulario de edición de perfil
router.post("/editarPerfil", validateCreate, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render("editarPerfil", { 
            errors: errors.array(),
            user: req.body
        });
    }

    const { nom, ape, ema, num, gender } = req.body;
    const userId = req.session.userId;

    const actualizarUsuario = "UPDATE usuario SET nombres = ?, apellidos = ?, correo = ?, num_telefonico = ?, genero = ? WHERE id = ?";
    conexion.query(actualizarUsuario, [nom, ape, ema, num, gender, userId], (error) => {
        if (error) {
            console.log("Error al actualizar el perfil del usuario", error);
            return res.status(500).send("Error en el servidor");
        }

        console.log("Perfil actualizado correctamente");
        res.redirect("/dashboard_jmedico/perfil");
    });
});

module.exports = router;




