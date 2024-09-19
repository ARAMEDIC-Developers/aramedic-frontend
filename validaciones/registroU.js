const { check } = require('express-validator');

const validateCreate = [
    check('nom')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),

    check('ape')
        .notEmpty().withMessage('El apellido es obligatorio')
        .isLength({ min: 2 }).withMessage('El apellido debe tener al menos 2 caracteres'),

    check('ema')
        .isEmail().withMessage('Debe ser un correo válido')
        .notEmpty().withMessage('El correo es obligatorio'),

    check('num')
        .notEmpty().withMessage('El celular es obligatorio')
        .isMobilePhone().withMessage('Debe ser un número de celular válido'),

    check('dni')
        .notEmpty().withMessage('El DNI es obligatorio')
        .isLength({ min: 8, max: 8 }).withMessage('El DNI debe tener 8 dígitos')
        .isNumeric().withMessage('El DNI debe contener solo números'),

    check('contra')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una letra mayúscula')
        .matches(/[a-z]/).withMessage('La contraseña debe contener al menos una letra minúscula')
        .matches(/\d/).withMessage('La contraseña debe contener al menos un número'),

    check('confirm_contra')
        .custom((value, { req }) => {
            if (value !== req.body.contra) {
                throw new Error('Las contraseñas no coinciden.');
            }
            return true;
        }),
];

module.exports = { validateCreate };
