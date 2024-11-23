const checkLoginAdmin = (req, res, next) => {
    console.log("Contenido de la sesión:", req.session);

    if (req.session.login == true && req.session.rol == 3) {
        return next();
    } else {
        res.redirect('/login');
    }
};

module.exports = checkLoginAdmin;