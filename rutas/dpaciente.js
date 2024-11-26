const express = require("express");
const router= express.Router();
const conexion=require("../config/conexion");
const link= require("../config/link");
const checkLoginPaciente = require('../validaciones/authPaciente');

router.get("/dashboard_paciente", function(req,res){
    const data = {
        'total_citas':0,
        'titulo' : 'pagina de calendario',
        'usuario': req.session,
        'link' : link,
    };
    res.render("dashboard_paciente/calendario", data);
});

router.get("/dashboard_paciente/calendario", checkLoginPaciente, async (req,res) => {
    // traer citas de la base de datos
    // const citas = database.Citas('select * from citas');
    const data = {
        'total_citas':0,
        'titulo' : 'pagina de calendario',
        'usuario': req.session,
        'link' : link,
    };
    res.render("dashboard_paciente/calendario", data);
});

router.get("/dashboard_paciente/solicitar_consulta", checkLoginPaciente, async (req, res) => {
    const medico_servicios = `
    SELECT m.id AS medico_id, 
           m.nombre AS medico_nombre, 
           m.apellido AS medico_apellido,
           GROUP_CONCAT(
               CONCAT(s.id, '|', s.nombre, '|', s.descripcion, '|', s.costo) 
               SEPARATOR ','
           ) AS servicios
    FROM medicos m
    JOIN medico_servicio ms ON m.id = ms.medico_id
    JOIN servicios s ON ms.servicio_id = s.id
    GROUP BY m.id;
    `;

    conexion.query(medico_servicios, async function(error, rows) {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: "Error al obtener médicos" });
        }

        const med_sv = rows.map(medico => {
            const servicios = medico.servicios.split(',').map(servicio => {
                const [servicio_id, servicio_nombre, servicio_descripcion, servicio_costo] = servicio.split('|');
                return {
                    servicio_id: servicio_id, 
                    servicio_nombre: servicio_nombre, 
                    servicio_descripcion: servicio_descripcion, 
                    servicio_costo: parseFloat(servicio_costo) 
                };
            });
            return {
                medico_id: medico.medico_id,
                medico_nombre: medico.medico_nombre,
                medico_apellido: medico.medico_apellido,
                servicios 
            };
        });

        const data = {
            'usuario': req.session,
            'link': link,
            'medico_servicios': med_sv 
        };
        console.log(med_sv) // VERIFICAR FUNCIONALIDAD (BORRAR)
        res.status(200).render("dashboard_paciente/solicitar_consulta", data);
    });
});

router.post("/dashboard_paciente/solicitar_consulta", checkLoginPaciente, async (req,res) => {
    const idusuario = req.session.paciente_id;
    const {medico_id, servicio_id, fecha, hora} =req.body;
    const citas = `
    INSERT INTO citas(paciente_id, medico_id, servicio_id, fecha, hora)
    VALUES (?, ?, ?, ?, ?)
    `
    conexion.query(citas, [idusuario, medico_id, servicio_id, fecha, hora], async function(error, rows){
        if (error) {
            console.error(error);
            return res.status(500).json({ error: "Error al registrar la cita" });
        }
        const data = {
            'titulo': 'Página de calendario',
            'usuario': req.session,
            'link': link,
        };
        res.status(200).render("dashboard_paciente/calendario", data);
    });
});

router.get("/dashboard_paciente/citas", checkLoginPaciente, async (req,res) => {
    // const citas = database.Historias('select * from historias');
    const data = {
        'usuario': req.session,
        'link' : link,
    };
    res.render("dashboard_paciente/citas", data);
});

router.get("/dashboard_paciente/historia_clinica", checkLoginPaciente, async (req,res) => {
    //TRAER HISTORIA DE LA BD
    const idusuario = req.session.paciente_id;
    const historia = `
        SELECT p.nombre AS nombre_paciente, p.apellido AS apellido_paciente, p.fecha_nacimiento, p.telefono,
               p.email, p.direccion, p.genero, p.estado_civil, p.ocupacion, h.motivo, h.enfermedades_previas, 
               h.alergias, h.medicamentos_actuales, h.cirugias_previas, h.fuma, h.consume_alcohol, 
               h.enfermedades_hereditarias, h.peso, h.altura, h.imc, h.descripcion_fisica,
               h.cirugia, h.procedimiento, h.riesgos, h.cuidado_preoperativo, h.cuidado_postoperativo
        FROM historial_medico h
        JOIN pacientes p ON h.paciente_id = p.id
        WHERE h.paciente_id = ?;
    `;
    conexion.query(historia, idusuario, async function(error,rows){
        if (error) 
            {
                console.log("TRIKA error en la consulta de verificación", error);
                return res.status(500).send(error);
            }
        else if(rows < 1){
            console.log('ERROR')
            //MOSTAR INGRESO DE DATOS
        }
        else{
            const historial_medico = rows[0];
            const data = {
                'usuario': req.session,
                'link' : link,
                'historia' : historial_medico
            };
            res.render("dashboard_paciente/historia_clinica", data)
        }
    })
});

router.get("/dashboard_paciente/test", checkLoginPaciente, async (req,res) => {
    // traer citas de la base de datos
    // const citas = database.Citas('select * from citas');

    const data = {
        'total_citas': 0,
        'titulo' : 'pagina de calendario'
    };
    res.render('dashboard_paciente/test', data);
});

router.post("/dashboard_paciente/test", checkLoginPaciente, (req,res) => {
    // console.log(req.body);
    const data = {
        'username': req.body.username,
    };
    res.json(data);
});
module.exports= router;