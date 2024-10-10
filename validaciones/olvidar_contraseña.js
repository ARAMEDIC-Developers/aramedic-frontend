const { check } = require('express-validator');

const validateForgotPassword = [
    check('email')
        .notEmpty().withMessage('El correo es obligatorio')
        .isEmail().withMessage('Debe ser un correo válido')
];

module.exports = { validateForgotPassword };
