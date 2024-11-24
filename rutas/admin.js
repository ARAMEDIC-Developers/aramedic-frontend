const express = require("express");
const PDFDocument = require('pdfkit');
const archiver = require('archiver');
const router = express.Router();
const conexion = require("../config/conexion");
const link = require("../config/link");
const { validarServicio } = require('../validaciones/servicios');
const checkLoginAdmin = require("../validaciones/authAdmin");

router.get("/dashboard_admin", checkLoginAdmin, function(req,res){
    const data = {
        'link' : link,
        'usuario': req.session
    }

    res.render("dashboard_admin/gestion_calendario", data);
});


router.get("/dashboard_admin/historias", checkLoginAdmin, (req, res) => {
    const buscar = req.query.buscar ?? ""; // Capturar el parámetro de búsqueda desde la URL

    const historias = `
        SELECT 
            h.id, -- Sin alias, para mantener consistencia con el controlador del médico
            u.dni, 
            p.nombre AS nombre_paciente, 
            p.apellido AS apellido_paciente, 
            p.telefono, 
            p.email, 
            h.motivo, 
            h.cirugia, 
            h.procedimiento,
            m.nombre AS nombre_medico, 
            m.apellido AS apellido_medico
        FROM historial_medico h
        JOIN pacientes p ON h.paciente_id = p.id
        JOIN usuarios u ON u.id = p.usuario_id
        JOIN medicos m ON h.medico_id = m.id
        WHERE 
            p.nombre LIKE CONCAT(?, '%') 
            OR p.apellido LIKE CONCAT(?, '%') 
            OR u.dni LIKE CONCAT(?, '%') 
            OR p.email LIKE CONCAT(?, '%')
        ORDER BY h.id DESC;
    `;

    conexion.query(historias, [buscar, buscar, buscar, buscar], (error, rows) => {
        if (error) {
            console.error("Error al obtener historias clínicas:", error);
            return res.status(500).send("Error al obtener las historias clínicas.");
        }

        const data = {
            usuario: req.session,
            link: link,
            historias: rows, // Enviar directamente los resultados de la consulta
            buscar, // Enviar el término de búsqueda actual para mostrarlo en el front
        };

        res.render("dashboard_admin/historias", data);
    });
});




router.get("/dashboard_admin/historia_clinica", checkLoginAdmin, function(req, res) {
    
    const historiaid = req.query.historiaId; // ID de la historia clínica desde los parámetros

    // Imprimir el valor de historiaId para ver si está llegando correctamente
    console.log("ID de historia clínica recibido:", historiaid);

    if (!historiaid) {
        return res.status(400).send('ID de historia clínica no proporcionado.');
    }

    // Consulta SQL para obtener los detalles de la historia clínica sin restricciones
    const historia = `
        SELECT p.nombre AS nombre_paciente, p.apellido AS apellido_paciente, p.fecha_nacimiento, p.telefono,
               p.email, p.direccion, p.genero, p.estado_civil, p.ocupacion, h.motivo, h.enfermedades_previas,
               h.id, h.alergias, h.medicamentos_actuales, h.cirugias_previas, h.fuma, h.consume_alcohol, 
               h.enfermedades_hereditarias, h.peso, h.altura, h.imc, h.descripcion_fisica,
               h.cirugia, h.procedimiento, h.riesgos, h.cuidado_preoperativo, h.cuidado_postoperativo
        FROM historial_medico h
        JOIN pacientes p ON h.paciente_id = p.id
        WHERE h.id = ?; 
    `;

    // Ejecutar la consulta
    console.log("Ejecutando consulta SQL con historiaId:", historiaid);  // Ver la consulta antes de ejecutarse

    conexion.query(historia, [historiaid], function(error, rows) {
        if (error) {
            console.log("Error al obtener historia clínica", error);
            return res.status(500).send("Error al obtener la historia clínica.");
        }

        // Si no se encuentra ningún resultado
        if (rows.length === 0) {
            console.log("No se encontró la historia clínica con ID:", historiaid);
            return res.status(404).send("Historia clínica no encontrada.");
        }

        // Si se encontró la historia clínica
        console.log("Historia clínica encontrada:", rows[0]);

        // Renderizar la vista de historia clínica, pasando los datos recuperados
        const historiaClinica = rows[0];
        const data = {
            'usuario': req.session,
            'link': link, // Asegúrate de definir 'link' o eliminar si no lo usas
            'historia': historiaClinica
        };

        res.render("dashboard_admin/historia_clinica", data);
    });
});



router.post("/dashboard_admin/historia_clinica", checkLoginAdmin, async (req, res) => {
    
    const historiaId = req.body.historiaId;
    
    if (!historiaId) {
        return res.status(400).send("El ID del historial clínico no está definido.");
    }

    const { motivo, enfermedadesPrevias, alergias, medicamentosActuales, cirugiasPrevias, fuma,
        consumeAlcohol, enfermedadesHereditarias, peso, altura, imc, descripcionFisica, cirugia,
        procedimiento, riesgos, cuidadoPreoperativo, cuidadoPostoperativo } = req.body;

    const query = `
        UPDATE historial_medico
        SET motivo = ?, enfermedades_previas = ?, alergias = ?, medicamentos_actuales = ?,
            cirugias_previas = ?, fuma = ?, consume_alcohol = ?, enfermedades_hereditarias = ?,
            peso = ?, altura = ?, imc = ?, descripcion_fisica = ?, cirugia = ?, procedimiento = ?,
            riesgos = ?, cuidado_preoperativo = ?, cuidado_postoperativo = ?
        WHERE id = ?;
    `;

    conexion.query(
        query, [motivo, enfermedadesPrevias, alergias, medicamentosActuales, cirugiasPrevias, fuma,
            consumeAlcohol, enfermedadesHereditarias, peso, altura, imc, descripcionFisica, cirugia,
            procedimiento, riesgos, cuidadoPreoperativo, cuidadoPostoperativo, historiaId
        ],
        (error, results) => {
            if (error) {
                console.log("Error al actualizar la historia clínica:", error);
                return res.status(500).send("Error al actualizar la historia clínica.");
            }

            if (results.affectedRows === 0) {
                return res.status(404).send("No se encontró el historial clínico o no tienes permisos para editarlo.");
            }

            res.redirect("/dashboard_admin/historias");
        }
    );
});


router.get("/dashboard_admin/gestion_calendario", checkLoginAdmin, async (req,res) => {
    // traer citas de la base de datos
    // const citas = database.Citas('select * from citas');

    const data = {
        'total_citas':0,
        'titulo' : 'pagina de calendario',
        'link' : link,
        'usuario': req.session
    };
    
    res.render("dashboard_admin/gestion_calendario", data);
});

// router.get("/dashboard_jmedico/test", checkLoginMedico, async (req,res) => {
//     // traer citas de la base de datos
//     // const citas = database.Citas('select * from citas');

//     const data = {
//         'total_citas':0,
//         'titulo' : 'pagina de calendario',
//         'usuario': req.session
//     };
    
//     res.render('dashboard_medico/test', data);
// });

// router.post("/dashboard_jmedico/test", checkLoginMedico, (req,res) => {

//     // console.log(req.body);

//     const data = {
//         'username': req.body.username,
//     };
    
//     res.json(data);
// });

router.get("/dashboard_admin/citas", checkLoginAdmin, async (req, res) => {
    try {
        console.log("ID del administrador:", req.session.admin_id); // Verifica si admin_id es correcto
        
        const consultaCitas = `
            SELECT c.id, c.paciente_id, c.medico_id, c.servicio_id, c.fecha, c.hora, c.estado
            FROM citas c
        `;
        
        // Realiza la consulta a la base de datos
        const [citas] = await conexion.query(consultaCitas);
        console.log("Citas obtenidas:", citas); // Verifica si la consulta devuelve datos

        // Prepara los datos para la vista
        const data = {
            'titulo': 'Página de Citas',
            'link': link,
            'usuario': req.session,
            'citas': citas || [] // Asegura que sea un array
        };

        // Renderiza la vista
        res.render("dashboard_admin/citas", data);
    } catch (error) {
        console.error("Error al obtener citas:", error); // Muestra el error en la consola
        res.status(500).send("Guau");
    }
});


router.get("/dashboard_admin/cuentas", checkLoginAdmin, async (req,res) => {

    const data = {
        'total_citas':0,
        'titulo' : 'pagina de citas',
        'link' : link,
        'usuario': req.session
    };
    
    res.render("dashboard_admin/cuentas", data);
});


// Ruta para mostrar la lista de servicios con admin_id
router.get("/dashboard_admin/servicios", checkLoginAdmin, async (req, res) => {
    try {
        const admin_id = req.session.admin_id;
        const consultaServicios = `
            SELECT s.id, s.nombre, s.descripcion, s.costo
            FROM medico_servicio m
            JOIN servicios s ON m.servicio_id = s.id
            WHERE m.medico_id = ?
        `;
        
        // Realiza la consulta a la base de datos
        const [servicios] = await conexion.query(consultaServicios, [admin_id]);

        // Prepara los datos para la vista
        const data = {
            'link': link,
            'usuario': req.session,
            'servicios': servicios || [] // Asegura que sea un array
        };

        // Renderiza la vista
        res.render("dashboard_admin/servicios", data);
    } catch (error) {
        console.error("Error al obtener servicios:", error);
        res.status(500).send("Error al obtener servicios");
    }
});

// router.get("/dashboard_jmedico/servicios/buscar", checkLoginMedico, async (req, res) => {
//     const { nombre } = req.query;
//     //ARREGLAR BUSCAR
//     try {
//         let query = "SELECT s.nombre, s.descripcion, s.costo FROM medico_servicio m JOIN servicios s ON m.servicio_id = s.id WHERE m.medico_id = "+req.session.medico_id;
//         if (nombre) {
//             query += " AND nombre LIKE ?";
//             const servicios = await conexion.query(query, [`${nombre}%`]);
//             return res.json(servicios);
//         } else {
//             const servicios = await conexion.query(query);
//             return res.json(servicios);
//         }
//     } catch (error) {
//         console.error("Error al buscar servicios:", error);
//         res.status(500).send("Error al buscar servicios");
//     }
// });

// //PARA ADMIN EDITAR COMPLETO / 
// router.post("/dashboard_jmedico/servicios/guardar", checkLoginMedico, async (req, res) => {
//     const { nombre, descripcion, costo } = req.body;
//     // Validar datos de entrada
//     const validacion = validarServicio({ nombre, descripcion, costo });
//     if (!validacion.valido) {
//         return res.status(400).json({ mensaje: validacion.mensaje });
//     }
//     try {
//         // Revisar si el nombre del servicio ya existe
//         const id = req.body.id;
//         const [servicioExistente] = await conexion.query("SELECT s.nombre, s.descripcion, s.costo, FROM servicios WHERE id = ?", [id]);
//         if (servicioExistente) {
//             // Si existe, actualizar la fila
//             await conexion.query(
//                 "UPDATE servicios SET nombre = ?, descripcion = ?, costo = ? WHERE id = ?",
//                 [nombre, descripcion, costo, id]
//             );
//             return res.json({ mensaje: "Servicio actualizado exitosamente" });
//         } else {
//             // Si no existe, insertar una nueva fila
//             await conexion.query(
//                 "INSERT INTO servicios (nombre, descripcion, costo) VALUES (?, ?, ?)",
//                 [nombre, descripcion, costo]
//             );
//             return res.json({ mensaje: "Servicio añadido exitosamente" });
//         }
//     } catch (error) {
//         console.error("Error al guardar el servicio:", error);
//         return res.status(500).json({ mensaje: "Error al guardar el servicio" });
//     }
// });

// router.delete("/dashboard_jmedico/servicios/eliminar/:id", checkLoginMedico, async (req, res) => {
//     const { id } = req.params;
//     const id_medico = req.session.medico_id;  
//     try {
//         //const result = await conexion.query("DELETE FROM servicios WHERE id = ?", [id]); | ELIMINAR ADMIN
//         //ELIMINAR SERVICIO POR MEDICO | USAR PROCEDURES
//         const result = await conexion.query("DELETE FROM medico_servicio WHERE medico_id = ? AND servicio_id = ?", [id_medico, id]);
//         if (result.affectedRows > 0) {
//             return res.json({ mensaje: "Servicio eliminado exitosamente" });
//         } else {
//             return res.status(404).json({ mensaje: "Servicio no encontrado" });
//         }
//     } catch (error) {
//         console.error("Error al eliminar servicio:", error);
//         return res.status(500).json({ mensaje: "Error al eliminar el servicio" });
//     }
// });

// router.post("/bloquear-fechas", async (req, res) =>{
//     try {
//         console.log("que fue.")
//         console.log(req.body)
//         console.log(req.session.medico_id)

//         conexion.query(`
//             INSERT INTO fechas(
//             fecha_inicio, 
//             fecha_final, 
//             id_usuario) 
//             VALUES (?,?,?)`, [
//                 req.body.fecha_inicio,
//                 req.body.fecha_final,
//                 req.session.medico_id
//             ]);

//         res.status(200).send("ok");
//     } catch (error) {
       
//         console.log(error)
//         return res.status(500).send("sessión terminada")
//     }
// });

// //Metodo para generar PDF
router.get("/dashboard_admin/historias/descargar_pdf/:id", checkLoginAdmin, (req, res) => {
    const historiaId = req.params.id;

    const query = `
        SELECT p.nombre AS nombre_paciente, p.apellido AS apellido_paciente, p.fecha_nacimiento, 
               h.motivo, h.enfermedades_previas, h.alergias, h.medicamentos_actuales
        FROM historial_medico h
        JOIN pacientes p ON h.paciente_id = p.id
        WHERE h.id = ?;
    `;

    conexion.query(query, [historiaId], (error, results) => {
        if (error || results.length === 0) {
            return res.status(404).send("Historia clínica no encontrada o no tienes permiso.");
        }

        const historia = results[0];
        const doc = new PDFDocument();

        // Configurar headers para la descarga
        res.setHeader("Content-Type", "application/pdf");
        // Modificar la línea para usar el nombre y apellido del paciente
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=historia_clinica_${historia.nombre_paciente}_${historia.apellido_paciente}.pdf`
        );

        // Generar contenido del PDF
        doc.pipe(res);

        // Encabezado
        doc.fontSize(16).text("Historia Clínica", { align: "center" });
        doc.moveDown();

        // Detalles del paciente
        doc.fontSize(12).text(`Paciente: ${historia.nombre_paciente} ${historia.apellido_paciente}`, { align: "left" });
        doc.text(`Fecha de nacimiento: ${historia.fecha_nacimiento}`, { align: "left" });
        doc.text(`Motivo de consulta: ${historia.motivo}`, { align: "left" });
        doc.moveDown();

        // Generación de la tabla
        const tableTop = doc.y + 20;
        const rowHeight = 20;
        const columnWidth = [120, 320]; // Tamaños de columnas
        let currentY = tableTop;

        // Títulos de la tabla
        doc.fontSize(12).text("Descripción", columnWidth[0], currentY, { width: columnWidth[0], align: "center" });
        doc.text("Detalle", columnWidth[0] + columnWidth[0], currentY, { width: columnWidth[1], align: "center" });
        currentY += rowHeight;

        // Filas de la tabla
        const rows = [
            ["Motivo de consulta", historia.motivo || "No especificado"],
            ["Enfermedades previas", historia.enfermedades_previas || "N/A"],
            ["Alergias", historia.alergias || "N/A"],
            ["Medicamentos actuales", historia.medicamentos_actuales || "N/A"]
        ];

        // Dibujar las filas de la tabla
        rows.forEach(row => {
            doc.text(row[0], columnWidth[0], currentY, { width: columnWidth[0], align: "center" });
            doc.text(row[1], columnWidth[0] + columnWidth[0], currentY, { width: columnWidth[1], align: "center" });
            currentY += rowHeight;
        });
        
        // Finalizar el documento
        doc.end(); 
    });
});

router.get("/dashboard_admin/historias/descargar_todos_pdf", checkLoginAdmin, (req, res) => {
    const idusuario = req.session.admin_id; // Asegúrate de que el id del administrador esté disponible

    // Consulta para obtener todas las historias clínicas del administrador
    const historias = `
        SELECT h.id, p.nombre AS nombre_paciente, p.apellido AS apellido_paciente
        FROM historial_medico h
        JOIN pacientes p ON h.paciente_id = p.id;
    `;

    conexion.query(historias, (error, rows) => {
        if (error || rows.length === 0) {
            return res.status(404).send("No se encontraron historias clínicas.");
        }

        // Crear archivo ZIP
        const zip = archiver('zip', { zlib: { level: 9 } });
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename=historias_clinicas.zip');

        // Pipe the archive to the response
        zip.pipe(res);

        // Iterar sobre todas las historias y generar los PDFs
        rows.forEach(historia => {
            const doc = new PDFDocument();
            const nombrePaciente = historia.nombre_paciente;
            const apellidoPaciente = historia.apellido_paciente;

            // Nombre del archivo dentro del ZIP usando nombre y apellido del paciente
            const nombreArchivo = `historia_clinica_${nombrePaciente}_${apellidoPaciente}.pdf`;

            // Añadir cada PDF al archivo ZIP con el nombre del paciente
            zip.append(doc, { name: nombreArchivo });

            // Generar contenido del PDF
            doc.fontSize(16).text("Historia Clínica", { align: "center" });
            doc.moveDown();
            doc.fontSize(12).text(`Paciente: ${nombrePaciente} ${apellidoPaciente}`, { align: "left" });
            doc.text(`Historia clínica ID: ${historia.id}`, { align: "left" });

            // Aquí puedes incluir más detalles de la historia clínica si lo deseas
            doc.end();
        });

        // Finalizar la creación del archivo ZIP
        zip.finalize();
    });
});



// router.get('/dashboard_jmedico/registrar_historia_clinica', checkLoginMedico, function(req, res) {
//     const idusuario = req.session.medico_id;

//     // Consulta para obtener los pacientes relacionados con el médico
//     const pacientesQuery = `
//         SELECT p.id, p.nombre, p.apellido, p.telefono, p.email
//         FROM pacientes p
//         JOIN historial_medico h ON p.id = h.paciente_id
//         WHERE h.medico_id = ?
//     `;
    
//     // Consulta para obtener todos los médicos
//     const medicosQuery = 'SELECT id, nombre, apellido FROM medicos';
    
//     conexion.query(pacientesQuery, [idusuario], function(error, pacientes) {
//         if (error) {
//             console.log("Error al obtener pacientes", error);
//             return res.status(500).send("Error al obtener pacientes.");
//         }

//         // Consulta para obtener la lista de médicos
//         conexion.query(medicosQuery, function(error, medicos) {
//             if (error) {
//                 console.log("Error al obtener médicos", error);
//                 return res.status(500).send("Error al obtener médicos.");
//             }

//             // Pasamos la lista de pacientes y médicos a la vista
//             const data = {
//                 'usuario': req.session,
//                 'link': link,
//                 'pacientes': pacientes,  // Lista de pacientes
//                 'medicos': medicos       // Lista de médicos
//             };

//             res.render("dashboard_medico/registro_historia_clinica", data);
//         });
//     });
// });

// router.post('/dashboard_jmedico/guardar_historia_clinica', checkLoginMedico, function(req, res) {
//     const { 
//         pacienteId, 
//         motivo, enfermedadesPrevias, alergias, medicamentosActuales, cirugiasPrevias,
//         fuma, consumeAlcohol, enfermedadesHereditarias, peso, altura, imc, descripcionFisica,
//         cirugia, procedimiento, riesgos, cuidadoPreoperativo, cuidadoPostoperativo
//     } = req.body;

//     // Obtener el ID del médico logueado desde la sesión
//     const medicoId = req.session.medico_id;

//     // Verificar que el medicoId esté disponible
//     if (!medicoId) {
//         return res.status(400).send("Error: ID del médico no encontrado.");
//     }

//     // Asegurar que los valores numéricos sean de tipo correcto
//     const validatedFuma = parseInt(fuma) === 1 ? 1 : 0;  // Aseguramos que 'fuma' sea 1 o 0
//     const validatedConsumeAlcohol = parseInt(consumeAlcohol) === 1 ? 1 : 0; // Lo mismo para 'consumeAlcohol'
//     const validatedPeso = peso ? parseFloat(peso) : null; // Aseguramos que peso sea un número o null
//     const validatedAltura = altura ? parseFloat(altura) : null; // Lo mismo para altura
//     const validatedImc = imc ? parseFloat(imc) : null; // Aseguramos que imc sea un número o null

//     // Verificar que todos los datos necesarios estén presentes
//     if (!pacienteId || !motivo) {
//         return res.status(400).send("Error: Los campos 'Paciente' y 'Motivo' son obligatorios.");
//     }

//     // Datos a insertar en la base de datos
//     const values = [
//         parseInt(medicoId),   // Aseguramos que medicoId sea un número
//         parseInt(pacienteId), // Aseguramos que pacienteId sea un número
//         motivo, 
//         enfermedadesPrevias || null, 
//         alergias || null, 
//         medicamentosActuales || null, 
//         cirugiasPrevias || null, 
//         validatedFuma, 
//         validatedConsumeAlcohol, 
//         enfermedadesHereditarias || null, 
//         validatedPeso, 
//         validatedAltura, 
//         validatedImc, 
//         descripcionFisica || null, 
//         cirugia || null, 
//         procedimiento || null, 
//         riesgos || null, 
//         cuidadoPreoperativo || null, 
//         cuidadoPostoperativo || null
//     ];

//     console.log("Valores que se enviarán a la consulta SQL:", values);

//     // Consulta SQL para insertar la historia clínica (el campo 'id' es autoincremental)
//     const historia = `
//         INSERT INTO historial_medico 
//         (medico_id, paciente_id, motivo, enfermedades_previas, alergias, 
//         medicamentos_actuales, cirugias_previas, fuma, consume_alcohol, 
//         enfermedades_hereditarias, peso, altura, imc, descripcion_fisica, 
//         cirugia, procedimiento, riesgos, cuidado_preoperativo, cuidado_postoperativo)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
//     `;

//     // Ejecutar la consulta SQL
//     conexion.query(historia, values, function(error, result) {
//         if (error) {
//             console.log("Error al guardar historia clínica:", error.message);
//             return res.status(500).send("Error al guardar la historia clínica. Detalles: " + error.message);
//         }
        
//         // Redirigir al usuario a la página de historias clínicas si todo fue exitoso
//         res.redirect("/dashboard_jmedico/historias");
//     });
// });

// router.get('/dashboard_jmedico/getPaciente/:id', checkLoginMedico, function(req, res) {
//     const pacienteId = req.params.id;

//     // Suponiendo que tienes una consulta a la base de datos para obtener los datos del paciente
//     const query = 'SELECT * FROM pacientes WHERE id = ?';
//     conexion.query(query, [pacienteId], function(error, result) {
//         if (error) {
//             console.log("Error al obtener el paciente", error);
//             return res.status(500).send("Error al obtener el paciente.");
//         }

//         if (result.length > 0) {
//             res.json(result[0]); // Retorna el primer paciente encontrado
//         } else {
//             res.status(404).send("Paciente no encontrado.");
//         }
//     });
// });

// router.get('/dashboard_jmedico/getMedico/:id', checkLoginMedico, function(req, res) {
//     const medicoId = req.params.id;

//     // Validar que el id sea un número entero positivo
//     if (isNaN(medicoId) || medicoId <= 0) {
//         return res.status(400).send("ID de médico no válido.");
//     }

//     // Consulta para obtener los detalles del médico
//     const query = 'SELECT * FROM medicos WHERE id = ?';
//     conexion.query(query, [medicoId], function(error, result) {
//         if (error) {
//             console.log("Error al obtener el médico: ", error.message);
//             return res.status(500).send("Error al obtener el médico: " + error.message);
//         }

//         if (result.length > 0) {
//             res.json(result[0]); // Retorna el primer médico encontrado
//         } else {
//             res.status(404).send("Médico no encontrado.");
//         }
//     });
// });

module.exports = router;
