const { check } = require('express-validator');

const validateItem= [
    check('dni')
        .notEmpty().withMessage('El DNI es obligatorio')
        .isLength({ min: 8, max: 8 }).withMessage('El DNI debe tener 8 dígitos')
        .isNumeric().withMessage('El DNI debe contener solo números'),

    check('contra')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una letra mayúscula')
        .matches(/[a-z]/).withMessage('La contraseña debe contener al menos una letra minúscula')
        .matches(/\d/).withMessage('La contraseña debe contener al menos un número'),

];

module.exports = { validateItem };
