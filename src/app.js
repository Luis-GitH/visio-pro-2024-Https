require("dotenv").config();

const f = require("./modules/funcionesLog.js");

const express = require("express"),
    path = require("path"),
    passport = require("passport"),
    flash = require("connect-flash");

const app = express(),
    cookieParser = require("cookie-parser"),
    session = require("express-session"),
    mariadb = require("mariadb"),
    MySQLStore = require("express-mysql-session")(session);
require("./modules/passport")(passport);

// Configuración de la base de datos
const dbOptions = require('./config/dbOption.js');
 
// Crea el almacenamiento de sesiones usando MariaDB
const sessionStore = new MySQLStore(dbOptions);

// settings

app.locals.fechaLog = f.fechaLog;

app.set("port", process.env.SERVER_PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// required for passport
app.use(
    // session({
    //     secret: process.env.KEY,
    //     resave: true, // reiniciar y guardar
    //     saveUninitialized: true, //guardar obj vacio
    // })
    session({
        key: 'visionaSesionCokie', // Nombre de la cookie de sesión
        secret: process.env.KEY, // Cambia esto por una clave secreta segura
        store: sessionStore,
        resave: false, // No guarda la sesión si no se modifica
        saveUninitialized: false, // No guarda sesiones vacías
        cookie: {
            secure: true, // Solo en HTTPS
            httpOnly: true, // Evita acceso desde JS en el cliente
            sameSite: 'strict', // Protege contra CSRF
            maxAge: 3600000, // Duración de la cookie
        },
      })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// routes
require("./app/routes/routes")(app, passport);

// correo se declara en routes
//const  enviarCorreo= require("./modules/eMailModule");

const checkIp = require("./modules/ipModule");
// static files
app.use(express.static(path.join(__dirname, "public")));

// start the server
// app.listen(app.get('port'), () => {
//   console.log(new Date().toISOString(),'server on port ', app.get('port'));
// });

module.exports = app;
