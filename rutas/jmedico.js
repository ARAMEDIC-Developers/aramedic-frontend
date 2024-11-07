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

router.get("/dashboard_jmedico/historias", checkLoginMedico, function(req,res){
    const idusuario = req.session.med;
    const historias = 'SELECT h.id, u.dni AS dni_paciente, p.nombre AS nombre_paciente, p.apellido AS apellido_paciente, p.fecha_nacimiento AS fecha_paciente, p.telefono AS paciente_telefono, p.email AS paciente_email, h.descripcion, h.diagnostico, h.tratamiento FROM historial_medico h JOIN pacientes p ON h.paciente_id= p.id JOIN medicos m ON h.medico_id = m.id JOIN usuarios u ON u.paciente_id = p.id WHERE h.medico_id = ?;'
    conexion.query(historias, idusuario, async function(error,rows){
        if (error) 
            {
                console.log("TRIKA error en la consulta de verificación", error);
                return res.status(500).send(error);
            }
        else{
            const historial_medico = rows;
            const data = {
                'usuario': req.session,
                'link' : link,
                'paciente' : historial_medico
            };
            console.log(historial_medico)
            res.render("dashboard_medico/historias", data);
        }
    })
});

router.get("/dashboard_jmedico/historia_clinica", checkLoginMedico, function(req,res){
    const idusuario = req.session.med;
    const historiaid = req.query.historiaId;

    if (!historiaid) {
        return res.status(400).send('ID de historia clínica no proporcionado.');
    }

    // Consulta SQL para obtener los detalles de la historia clínica
    const sql = `
        SELECT p.nombre AS nombre_paciente, p.apellido AS apellido_paciente, 
               m.nombre AS nombre_medico, m.especialidad_id AS especialidad_id,
               h.fecha, h.diagnostico, h.descripcion, h.tratamiento, h.observaciones
        FROM historial_medico h
        JOIN pacientes p ON h.paciente_id = p.id
        JOIN medicos m ON h.medico_id = m.id
        WHERE h.id = ? AND h.medico_id = ?;
    `;
    conexion.query(sql, [historiaid, idusuario], function(error, rows) {
        if (error) {
            console.log("Error al obtener historia clínica", error);
            return res.status(500).send("Error al obtener la historia clínica.");
        }

        if (rows.length === 0) {
            return res.status(404).send("Historia clínica no encontrada.");
        }

        // Renderizar la vista de edición, pasando los datos de la historia clínica
        const historiaClinica = rows[0];
        const data = {
            'usuario': req.session,
            'link': link,
            'historia': historiaClinica
        };
    res.render("dashboard_medico/historia_clinica", data);
    });
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
/*/
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
/*/
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

router.get("/dashboard_jmedico/cuentas", checkLoginMedico, async (req,res) => {

    const data = {
        'total_citas':0,
        'titulo' : 'pagina de citas',
        'link' : link,
        'usuario': req.session
    };
    
    res.render("dashboard_medico/cuentas", data);
});

router.get("/dashboard_jmedico/servicios", checkLoginMedico, async (req,res) => {

    const data = {
        'total_citas':0,
        'titulo' : 'pagina de citas',
        'link' : link,
        'usuario': req.session
    };
    
    res.render("dashboard_medico/servicios", data);
});

module.exports = router;