const express = require("express");
const router= express.Router();
const conexion=require("../config/conexion");
const link= require("../config/link");


router.get("/registroU",function(req,res){
    res.render("registro",{link});
});

router.post("/registroU",function(req,res){


    //validaciones entre la linea 14 y 20
    let nombres=req.body.nom;
    let apellidos=req.body.ape;
    let email=req.body.ema;
    let contrasena=req.body.contra;
    let DNI=req.body.dni;
    let genero=req.body.gender;
    let numero_telefonico = req.body.num;

    const idrolPaciente = 1;

    const insertar="INSERT INTO usuario (DNI,nombres,apellidos,num_telefonico,genero,correo,contrasena,idrol) VALUES ('"+DNI+"','"+nombres+"','"+apellidos+"','"+numero_telefonico+"','"+genero+"','"+email+"','"+contrasena+"','"+idrolPaciente+"')";
                conexion.query(insertar,function(error){
                    if (error) {
                        console.log("TRIKA error");
                        throw error;
                    } else {
                        console.log("TRIKA datos almacenados correctamente");
                        res.redirect(link+"login");
                    }
                });

});

module.exports=router;

