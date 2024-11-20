const express = require("express");
const router= express.Router();
const conexion=require("../config/conexion");
const link= require("../config/link");
const { validateCreate } = require('../validaciones/registroU');
const { validationResult } = require('express-validator');
const generatePassword = require('generate-password');
const bcrypt= require("bcrypt");
const saltRounds=10;

// Mostrar el formulario de registro
router.get("/registroU", function(req, res) {
    res.render("registro", { 
        link, 
        errors: [], // No hay errores en la primera carga
        oldData: {} // En la primera carga no hay datos previos
    });
});

// Procesar el formulario de registro
router.post("/registroU", validateCreate, async function(req, res)  {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Si hay errores, renderizamos la vista 'registro' con los errores y datos anteriores
        return res.render("registro", { 
            link, 
            errors: errors.array(), // Enviamos los errores a la vista
            oldData: req.body // Enviamos los datos ingresados para que se mantengan
        });
    }
 
    const { nom, ape, ema, num, dni, contra} = req.body;

    const idrolPaciente =1;

    try {
        const hashedPas=await bcrypt.hash(contra, saltRounds);

         // Si no hay errores, insertar el nuevo usuario en la base de datos
    const insertarUsuario = "INSERT INTO usuarios (dni, contrasena, rol_id) VALUES (?, ?, ?)";
    conexion.query(insertarUsuario, [dni, hashedPas, idrolPaciente], (error, result) => {
        if (error) {
            console.log("TRIKA error al insertar usuario", error);
            return res.status(500).send("Error al registrar el usuario");
        }
    const user_id = result.insertId;
    const insertarPaciente = "INSERT INTO pacientes (nombre, apellido, telefono, email, usuario_id) VALUES (?, ?, ?, ?, ?)";
    conexion.query(insertarPaciente, [nom, ape, num, ema, user_id], (error, result) => {
        if (error) {
            console.log("TRIKA error al insertar paciente", error);
            return res.status(500).send("Error al registrar el paciente");
        }
        console.log("TRIKA datos almacenados correctamente");
        res.redirect(link + "login");
    });
});
    } catch (error) {
        
    }

    // Verificar si el DNI, correo o número de celular ya existen
    const verificarUsuario = "SELECT * FROM usuarios WHERE dni = ?";
    conexion.query(verificarUsuario, [dni], (error, rows) => {
        if (error) {
            console.log("TRIKA error en la consulta de verificación", error);
            return res.status(500).send("TRIKA ERROR EN EL SERVIDOR");
        }
        if (rows.length > 0) {
            // Si ya existe un usuario con el DNI
            const mensajesError = [];
            if (rows.some(row => row.dni === dni)) mensajesError.push({ msg: "El DNI ya está registrado" });

            return res.render("registro", {
                link,
                errors: mensajesError,
                oldData: req.body
            });
        }


       
        /*/
        const obteneridUser='SELECT idusuario FROM `usuario` WHERE DNI = ?';
        conexion.query(obteneridUser, dni, (error, rows)=>{
            if(error){
                console.log(error)
            }
            else{
                const iduser = rows[0].idusuario;
                const procedure='CALL create_medical_history(?, ?, ?, ?, ?, ?)';
                conexion.query(procedure, [iduser, nom, ape, num, genderBool, ema], function(error){
                    if(error){
                        console.log(error)
                    }
                    else{
                        console.log('TRIKA AGREGADO HISTORIA')
                    }
                })
            }
        });
        /*/
    });
});
// Ruta para registrar cita
router.post("/registro-cita",async (req, res) =>{
    let connection = null;
    try {
        connection = await conec.beginTransaction();
        await conec.execute(connection, `
            INSERT INTO citas(
            paciente_id, 
            medico_id, 
            servicio_id,
            fecha,
            hora,
            estado) 
            VALUES (?,?,?,?,?,?)`, Object.values(req.body));
        await conec.commit(connection);
        res.status(201).send("prabando ruta");
    } catch (error) {
        if (connection != null) {
            await conec.rollback(connection);
        }
        console.log(error)
        return res.status(500).send("error en registrar")
    }
});

router.get("/suggestion-password", async (req, res) =>{
    const password = generatePassword.generate({
        length: 12,       // Longitud de la contraseña
        numbers: true,    // Incluir números
        symbols: true,    // Incluir símbolos
        uppercase: true,  // Incluir mayúsculas
        lowercase: true,  // Incluir minúsculas
        excludeSimilarCharacters: true // Excluir caracteres similares como 'i', 'l', '1'
    });
    res.status(200).send({"text": password});
});

module.exports = router;