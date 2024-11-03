const { check } = require('express-validator');
const conexion = require("../config/conexion");

const validateItem = [
    check('dni')
        .notEmpty().withMessage('El DNI es obligatorio')
        .isLength({ min: 8, max: 8 }).withMessage('El DNI debe tener 8 dígitos')
        .isNumeric().withMessage('El DNI debe contener solo números'),

    check('contra')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una letra mayúscula')
        .matches(/[a-z]/).withMessage('La contraseña debe contener al menos una letra minúscula')
        .matches(/\d/).withMessage('La contraseña debe contener al menos un número')
        .custom(async (value, { req }) => {
            // Validar en la base de datos si la contraseña coincide con el DNI
            const validar = "SELECT * FROM usuarios WHERE dni = ?";
            return new Promise((resolve, reject) => {
                conexion.query(validar, [req.body.dni], function(error, rows) {
                    if (error) {
                        return reject(new Error("Error en el servidor"));
                    }
                    if (rows.length < 1) {
                        // Si el DNI no existe en la base de datos
                        return reject(new Error("El DNI no está registrado"));
                    }
                    const user = rows[0];
                    if (user.contrasena !== value) {
                        // Si la contraseña no coincide
                        return reject(new Error("La contraseña es incorrecta"));
                    }
                    resolve(true);
                });
            });
        })
];

// Función que valida el DNI y contraseña en la base de datos
const validarDniYContrasena = async (dni, contrasena, req, res) => {
    const validar = "SELECT * FROM usuarios WHERE dni = ?";
    conexion.query(validar, [dni], async function(error, rows) {
        if (error) {
            console.log("TRIKA error consulta validar", error);
            return res.status(500).send("TRIKA ERROR EN EL SERVIDOR");
        }

        if (rows.length < 1) {
            // El DNI no existe
            const mensaje = "DNI no registrado";
            return res.render("login", {
                link: require('../config/link'),
                errors: [{ msg: mensaje }],
                oldData: req.body
            });
        } else {
            const user = rows[0];
            const match = contrasena === user.contrasena;

            if (!match) {
                // Contraseña incorrecta
                const mensaje = "Contraseña incorrecta";
                return res.render("login", {
                    link: require('../config/link'),
                    errors: [{ msg: mensaje }],
                    oldData: req.body
                });
            } else {
                // Si todo es correcto, iniciar sesión
                req.session.login = true;
                req.session.idusu = user.idusuario;
                req.session.dn = user.dni;
                req.session.nom = user.nombres;
                req.session.ape = user.apellidos;
                req.session.naci = user.fecha_nacimiento;
                req.session.tel = user.num_telefonico;
                req.session.gen = user.genero;
                req.session.cor = user.correo;
                req.session.contra = user.contrasena;
                req.session.rol = user.idrol;
                console.log(req.session); // comprobar los datos que inician sesión
                
                // Redirigir directamente al dashboard aquí
                return res.redirect("dashboard_jmedico");
            }
           
        }
    });
};

module.exports = { validateItem, validarDniYContrasena };