const express = require("express");
const router = express.Router();
const { validateItem, validarDniYContrasena } = require('../validaciones/login');
const { validationResult } = require('express-validator');
const link = require("../config/link");

router.get("/login", function(req, res) {
    res.render("login", { link, oldData: {} });
});

router.post("/login", validateItem, async function(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Mostrar errores de validación
        return res.render("login", {
            link,
            errors: errors.array(),
            oldData: req.body
        });
    }

    // Validar DNI y contraseña desde el archivo de validaciones
    await validarDniYContrasena(req.body.dni, req.body.contra, req, res);
});

module.exports = router;
