// Librerías
const path = require('path')
const express = require("express");
const app = express();
const methodOverride = require('method-override'); // Para usar métodos PUT y DELETE en formularios
const session = require('express-session');


//configuraciones
app.set("view engine","ejs");//paginas dinamicas
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method')); // Permite usar métodos PUT y DELETE


//manejo de sesiones
app.use(session({
    secret:"tu_contraseña",
    resave:false,
    saveUninitialized:false
}));


//rutas
app.use(express.static(path.join(__dirname, '../public')));
app.use(require("../rutas/login"));
app.use(require("../rutas/registroU"));
app.use(require("../rutas/jmedico"));
app.use(require("../rutas/dpaciente"));
app.use(require("../rutas/recuperarcuentaU"));




//configuracion del puerto del servidor
const PORT= process.env.PORT || 3000;
app.listen(PORT, function(){
    if (PORT==3000) {
        console.log("TRIKA Servidor creado http://localhost:3000")
    } else {
        console.log(PORT);
    }
});
