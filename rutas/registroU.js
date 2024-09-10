const express = require("express");
const router= express.Router();
const conexion=require("../config/conexion");
const link= require("../config/link");


router.get("/registroU",function(req,res){
    res.render("registro",{link});
});

router.post("/registroU",function(req,res){

    let nombres=req.body.nom;
    let apellidos=req.body.ape;
    let email=req.body.ema;
    let contrasena=req.body.contra;

    const insertar="INSERT INTO medico (nombre,apellido,correo,contrasena) VALUES ('"+nombres+"','"+apellidos+"','"+email+"','"+contrasena+"')";
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

