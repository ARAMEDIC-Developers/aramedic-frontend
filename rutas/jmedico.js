const express = require("express");
const router= express.Router();
const conexion=require("../config/conexion");
const link= require("../config/link");
const checkLoginMedico = require('../validaciones/authMedico');

router.get("/dashboard_jmedico", checkLoginMedico, function(req,res){
    const data = {
        'link' : link,
        'usuario': req.session

    }

    res.render("dashboard_medico/calendario", data);
});

router.get("/dashboard_jmedico/historia_clinica", checkLoginMedico, function(req,res){

    const data = {
        'link' : link,
        'usuario': req.session
    }

    res.render("dashboard_medico/historia_clinica", data);
});

router.post("/dashboard_jmedico/historia_clinica", checkLoginMedico, function(req,res){

    const data = {
        'link' : link,
        'usuario': req.session
    }

    res.json({mensaje: 'guardado correcto'});
    // res.render("dashboard_medico/historia_clinica", data);
});

router.get("/dashboard_jmedico/calendario", checkLoginMedico, async (req,res) => {
    // traer citas de la base de datos
    // const citas = database.Citas('select * from citas');

    const data = {
        'total_citas':0,
        'titulo' : 'pagina de calendario',
        'link' : link,
        'usuario': req.session
    };
    
    res.render("dashboard_medico/calendario", data);
});


router.get("/dashboard_jmedico/test", checkLoginMedico, async (req,res) => {
    // traer citas de la base de datos
    // const citas = database.Citas('select * from citas');

    const data = {
        'total_citas':0,
        'titulo' : 'pagina de calendario',
        'usuario': req.session
    };
    
    res.render('dashboard_medico/test', data);
});

router.post("/dashboard_jmedico/test", checkLoginMedico, (req,res) => {

    // console.log(req.body);

    const data = {
        'username': req.body.username,
    };
    
    res.json(data);
});

router.get("/dashboard_jmedico/historias", checkLoginMedico, async (req,res) => {
    // traer citas de la base de datos
    // const citas = database.Citas('select * from citas');
    const total_historias = 0;

    const data = {
        'total_citas':0,
        'titulo' : 'pagina de citas',
        'link' : link,
        'historias' : total_historias,
        'usuario': req.session
    };
    
    res.render("dashboard_medico/historias", data);
});

router.get("/dashboard_jmedico/citas", checkLoginMedico, async (req,res) => {
    // traer citas de la base de datos
    // const citas = database.Citas('select * from citas');
    const data = {
        'total_citas':0,
        'titulo' : 'pagina de citas',
        'link' : link,
        'usuario': req.session
    };
    
    res.render("dashboard_medico/citas", data);
});

router.get("/dashboard_jmedico/cuentas", checkLoginMedico, async (req, res) => {
    try {
        const usuarios = await conexion.query("SELECT idusuario, dni, nombres, apellidos, DATE_FORMAT(fecha_nacimiento, '%Y-%m-%d') AS fecha_nacimiento, num_telefonico, genero, idrol FROM usuario");
        const data = {
            'link': link,
            'usuario': req.session,
            'usuarios': usuarios
        };
        res.render("dashboard_medico/cuentas", data);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).send("Error al obtener usuarios");
    }
});

// Nuevo endpoint para filtrar usuarios por DNI
router.get("/dashboard_jmedico/cuentas/buscar", checkLoginMedico, async (req, res) => {
    const { dni } = req.query; // Obtener el DNI de la consulta

    try {
        let query = "SELECT idusuario, dni, nombres, apellidos, DATE_FORMAT(fecha_nacimiento, '%Y-%m-%d') AS fecha_nacimiento, num_telefonico, genero, idrol FROM usuario";
        if (dni) {
            query += " WHERE dni = ?";
            const usuarios = await conexion.query(query, [dni]);
            return res.json(usuarios); // Retornar solo los usuarios filtrados
        } else {
            // Si el campo está vacío, retornar todos los usuarios
            const usuarios = await conexion.query(query);
            return res.json(usuarios);
        }
    } catch (error) {
        console.error("Error al buscar usuarios:", error);
        res.status(500).send("Error al buscar usuarios");
    }
});


router.get("/dashboard_jmedico/servicios", checkLoginMedico, async (req, res) => {
    try {
        const servicios = await conexion.query("SELECT idservicio, nombre_servicio, tipo_procedimiento, costo, tiempo_estimado, tiempo_recuperacion FROM servicios");
        const data = {
            'link': link,
            'usuario': req.session,
            'servicios': servicios
        };
        res.render("dashboard_medico/servicios", data);
    } catch (error) {
        console.error("Error al obtener servicios:", error);
        res.status(500).send("Error al obtener servicios");
    }
});

router.get("/dashboard_jmedico/servicios/buscar", checkLoginMedico, async (req, res) => {
    const { nombre } = req.query;
    
    try {
        let query = "SELECT idservicio, nombre_servicio, tipo_procedimiento, costo, tiempo_estimado, tiempo_recuperacion FROM servicios";
        
        if (nombre) {
            query += " WHERE nombre_servicio LIKE ?";
            const servicios = await conexion.query(query, [`${nombre}%`]);
            return res.json(servicios);
        } else {
            const servicios = await conexion.query(query);
            return res.json(servicios);
        }
    } catch (error) {
        console.error("Error al buscar servicios:", error);
        res.status(500).send("Error al buscar servicios");
    }
});


module.exports = router;