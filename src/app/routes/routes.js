const { fechaLog, loger } = require("../../modules/funcionesLog"),
    nivelesModel = require("../models/alcanceMensual"),
    userModel = require("../models/user"),
    cmfModel = require("../models/cmf"),
    loginModel = require("../models/login");

// var dayjs = require("dayjs"); // require
// const date_ES = "YYYY-MM-DD HH:mm:ss";

const fs = require("fs");
const {
    procesarUpload,
    procesarTodoUpload,
    sql2excel,
} = require("../../modules/import");

const { enviarCorreo } = require("../../modules/eMailModule");

const multer = require("multer");
const jwt = require("jsonwebtoken");
const storage = multer.diskStorage({
    destination: "upload/",
    filename: function (req, file, cb) {
        cb("", file.originalname);
    },
});

const { render } = require("ejs");
const helpers = require("../../modules/helpers");
// const { DefaultDeserializer } = require("v8");
// const SendmailTransport = require("nodemailer/lib/sendmail-transport");

const upload = multer({
    storage: storage, // en las new versiones se puede usar storage solo
});
var uploadedFiles = {};
var menu = "Utilidad de recogida de CMFs";

module.exports = (app, passport) => {
    // index routes
    app.get("/", (req, res) => {
        res.render("login.ejs", {
            message: req.flash("loginMessage"),
        });
    });

    //login view
    app.get("/login", (req, res) => {
        res.render("login.ejs", {
            message: req.flash("loginMessage"),
        });
    });

    app.post(
        "/login",
        passport.authenticate("local-login", {
            successRedirect: "/api",
            failureRedirect: "/login",
            failureFlash: true,
        })
    );

    app.get("/api", (req, res, next) => {
        if (req.user.role === "admin") {
            res.redirect("panel");
        } else {
            res.redirect("download");
        }
        return next();
    });

    //// acceso a db
    app.post("/autenticar", (req, res) => {
        loger(
            `Acceso a DB User: ${req.body.usuario} Hostname: ${req.hostname} Method/Url: ${req.method}${req.url}  Ip: ${req.ip}`,
            "db"
        );
        if (
            req.body.usuario === process.env.SUP_USUARIO &&
            req.body.pwd === process.env.SUP_PWD
        ) {
            const payload = {
                check: true,
            };
            const token = jwt.sign(payload, process.env.KEY, {
                expiresIn: 1440,
            });
            res.json({
                mensaje: "ok",
                token: token,
            });
        } else {
            loger(
                `OJO intento de acceso por /autenticar'+ user: ${req.body.usuario} pwd: ${req.user.pwd}`,
                "login"
            );
            res.json({ mensaje: "error" });
        }
    });

    // signup view
    app.get("/signup", (req, res) => {
        res.render("signup", {
            message: req.flash("signupMessage"),
        });
    });

    app.post(
        "/signup",
        passport.authenticate("local-signup", {
            successRedirect: "/download",
            failureRedirect: "/signup",
            failureFlash: true, // allow flash messages
        })
    );

    //download view
    app.get("/download", isLoggedInMiddleware, async (req, res) => {
        if (!uploadedFiles[req.user.codigo]) {
        } else {
            if (uploadedFiles[req.user.codigo].length == 0) {
                uploadedFiles[req.user.codigo] = undefined;
            }
        }
        await loginModel.addLogin([
            req.user.codigo,
            req.user.nombreCentro,
            "entrada",
        ]);

        res.render("download", {
            user: req.user,
            file: req.file,
            loadedFiles: uploadedFiles[req.user.codigo],
            message: "",
            admin: isAdmin(req.user),
        });
    });

    // logout
    app.get("/logout", (req, res, next) => {
        // si se han seleccionado excel, enviamos notificación por correo
        const bDebug = false;
        let cmfsAtratar = [];
        /* if (bDebug)
            console.log(
                new Date().toISOString(),
                "llega el codigo",
                req.user.codigo
            ); */
        if (!uploadedFiles[req.user.codigo]) {
            loginModel.addLogin([
                req.user.codigo,
                req.user.nombreCentro,
                "Salida sin subir CMFs",
            ]);

            req.logout((err) => {
                if (err) {
                    return next(err); // Manejar el error en el middleware de errores
                }
                res.redirect("/"); // Redirigir al usuario después del cierre de sesión
            });
            return;
        }
        if (uploadedFiles[req.user.codigo]) {
            loginModel.addLogin([
                req.user.codigo,
                req.user.nombreCentro,
                "Salida con CMFs subidos",
            ]);

            var texto = `Excels subidos por el centro ${req.user.codigo}: \n \n`;
            for (var i = 0; i < uploadedFiles[req.user.codigo].length; i++) {
                texto += " ✸ " + uploadedFiles[req.user.codigo][i] + "\n";
                cmfsAtratar.push(uploadedFiles[req.user.codigo][i]);
            }
            if (bDebug) console.log("cmfsAtratar:", cmfsAtratar);

            uploadedFiles[req.user.codigo] = [];
            enviarCorreo(
                "info",
                `Notificacion de subidas de CMF's del Centro: ${req.user.nombreCentro}`,
                texto
            );
        }
        procesarUpload(req.user.codigo, cmfsAtratar);
        // loger('Salida user: ' + req.user.codigo, 'login'
        // req.logout();
        // res.redirect("/");
        req.logout((err) => {
            if (err) {
                return next(err); // Manejar el error en el middleware de errores
            }
            res.redirect("/"); // Redirigir al usuario después del cierre de sesión
        });
    });

    // fin de logout
    app.get("/upload", isLoggedInMiddleware, async (req, res) => {
        try {
            // para sincroniacion rapida

            //		loginModel.addLogin([req.user.codigo, req.user.nombreCentro, 'Salida con CMFs subidos'])
            const resultado = await procesarTodoUpload();
            // loger('Salida user: ' + req.user.codigo, 'login'

            return res.render("upload", { resultado, error: false });
        } catch (error) {
            return res.render("upload", {
                resultado: 0,
                error: error?.message || "Error desconocido",
            });
        }
    });

    // traemos los excels
    app.post(
        "/files",
        isLoggedInMiddleware,
        upload.single("file2load"),
        async (req, res) => {
            const bDebug = false;
            /* if (bDebug)
                loger(
                    new Date().toISOString(),
                    " * * * * entramos en /files * * * *"
                ); */
            if (req.file) {
                const excel = req.file.filename;
                const i = excel.indexOf("_202") + 1;
                const mes1 =
                    excel.substring(i, i + 4) +
                    "-" +
                    excel.substring(i + 4, i + 6);

                /*  if (bDebug)
                    loger(
                        new Date().toISOString(),
                        "este es el mes a tratar: ",
                        mes1
                    ); */

                // validamos que sea de octubre
                // validamos que empiece por CMF
                if (excel.substring(0, 3) != "CMF") {
                    fs.unlink("upload/" + req.file.filename, (err) => {
                        if (err) loger("Error upload1" + err, "err");
                        // if no error, file has been deleted successfully
                        /*  console.log(
                            new Date().toISOString(),
                            "Borrado: ",
                            excel 
                        );*/
                    });
                    res.render("download", {
                        user: req.user,
                        loadedFiles: uploadedFiles[req.user.codigo] || [],
                        message: `Este excel: ${excel} no es un CMFxxxxxxxxxx`,
                        admin: isAdmin(req.user),
                    });
                    if (bDebug)
                        loger(
                            "OJO hemos vuelto despues de no CMF" + mes1,
                            "err"
                        );
                    return;
                }
                if (["2024-10", "2023-10"].indexOf(mes1) == -1) {
                    // no es el mes lo borrmos y salimos
                    /* if (bDebug)
                        loger(
                            new Date().toISOString(),
                            " - - - - ya estaba y lo borramos - - - - "
                        ); */
                    fs.unlink("upload/" + req.file.filename, (err) => {
                        if (err) throw err;
                        // if no error, file has been deleted successfully
                        /*    console.log(
                            new Date().toISOString(),
                            "Borrado: ",
                            excel
                        ); */
                    });
                    res.render("download", {
                        user: req.user,
                        loadedFiles: uploadedFiles[req.user.codigo] || [],
                        message: `El CMF: ${excel} seleccionado no es de octubre`,
                        admin: isAdmin(req.user),
                    });
                    /* if (bDebug)
                        console.log(
                            new Date().toISOString(),
                            "OJO hemos vuelto despues de NO OCTUBRE ",
                            mes1
                        ); */
                    return;
                }

                // Empezamoa desde aqui una vez validado el mes

                if (!uploadedFiles[req.user.codigo]) {
                    // preparamos el registro de los CMFs subidos
                    // si esta vacio lo inicializamos y rellenamos con el file
                    uploadedFiles[req.user.codigo] = [];
                }
                // validamos si ya se ha subido
                if (uploadedFiles[req.user.codigo].length > 0) {
                    if (uploadedFiles[req.user.codigo].includes(excel)) {
                        // console.log(new Date().toISOString(),'* + * + *       se ha duplicado la entrada y volvemos   * + * + *')
                        // volver con el mensaje
                        res.render("download", {
                            user: req.user,
                            loadedFiles: uploadedFiles[req.user.codigo] || [],
                            message: `El CMF: ${excel} ya se ha subido`,
                            admin: isAdmin(req.user),
                        });
                        /*    if (bDebug)
                            console.log(
                                new Date().toISOString(),
                                "OJO hemos vuelto despues de duplicado ",
                                excel
                            ); */
                        return;
                    }
                }
                // preprmos las variables para render
                uploadedFiles[req.user.codigo].push(req.file.filename);

                // var insertQuery = "INSERT INTO cmfs ( centro, nombre,mes) values ('" + req.user.codigo + "','" + excel + "','" + mes1 + "')";
                // if (bDebug) console.log(new Date().toISOString(),insertQuery);
                /////////////////////////////////
                const cmfArr = [
                    req.user.codigo, // centro que se ha logueado
                    excel.substring(4, 12), // centro del CMF
                    excel,
                    mes1,
                    "Subido",
                    fechaLog(),
                ];
                const resultado = await cmfModel.addCmf(cmfArr);
                // volvemos a download
            }
            res.render("download", {
                user: req.user,
                loadedFiles: uploadedFiles[req.user.codigo] || [],
                message: "",
                admin: isAdmin(req.user),
            });
            return;
        }
    );

    // Panel de control page
    app.get(
        "/Panel",
        [isLoggedInMiddleware, isAdminMiddleware],
        async function (req, res) {
            // poner la consulta de centros que han subido
            var data;
            try {
                data = await nivelesModel.resumenAlumnos();
            } catch (e) {
                loger(`error1  ${e}`, err);
            }
            res.render("panel", { data });
        }
    );

    app.get(
        "/sql2e",
        [isLoggedInMiddleware, isAdminMiddleware],
        async function (req, res) {
            // poner la consulta de centros que han subido
            var resultado = false;
            try {
                await sql2excel();
                enviarCorreo(
                    "production",
                    `Actualización de los datos de alcance mensual`,
                    `<h1>Hola ${req.user.nombre}, </h1><p> adjunto el excel actualizado!</p>`,
                    [
                        {
                            path: "mysql2excel.xlsx",
                        },
                    ]
                );

                resultado = true;
            } catch (e) {
                loger("error Sql2Excel:  " + e, err);
                resultado = true;
            }
            res.render("sql2e", { resultado });
            return;
        }
    );

    // listado de centros
    app.get(
        "/centros",
        [isLoggedInMiddleware, isAdminMiddleware],
        async function (req, res) {
            const bDebug = false;
            // let centros = [], error
            centros = await userModel.findAll();

            // console.log("# centros:", centros.length);
            res.render("centros", {
                centros,
                message: req.flash("delete"),
            });
        }
    );

    // listado de cmfs importados
    app.get(
        "/cmfs",
        [isLoggedInMiddleware, isAdminMiddleware],
        async function (req, res) {
            const bDebug = false;
            cmfs = await cmfModel.findAll();
            /* if (bDebug)
                console.log( "cmfs", cmfs.length); */
            res.render("cmfs", {
                cmfs,
            });
        }
    );

    // listado de cmfs importados
    app.get(
        "/subidos",
        [isLoggedInMiddleware, isAdminMiddleware],
        async function (req, res) {
            const bDebug = false;
            rows = await cmfModel.subidos();
            /*  if (bDebug) console.log( "subidos", rows); */
            res.render("subidos", {
                rows,
            });
        }
    );

    // delete de centro
    app.get(
        "/delete/:codigo",
        [isLoggedInMiddleware, isAdminMiddleware],
        async (req, res) => {
            const { codigo } = req.params;
            await userModel.Delete(codigo);
            req.flash("delete", "Centro " + codigo + " borrado.");
            res.redirect("/centros");
        }
    );

    app.post("/addadiro", rutaBaseDeDatos, async (req, res) => {
        let role = "user";
        if (["00000000", "00281072"].includes(req.body.codigo)) role = "admin";
        const newUser = [
            req.body.clave,
            req.body.codigo,
            req.body.director,
            req.body.email,
            req.body.movil,
            req.body.nombre,
            req.body.nombreCentro,
            helpers.encryptPassword(req.body.clave),
            role,
            "Alta", // se modifica en destino con valor alta o actualizado
            fechaLog(), // dayjs().format(date_ES),
        ];
        const resultado = await userModel.addUsuario(newUser);
        res.send(resultado);
    });

    app.post("/cmfsUp", rutaBaseDeDatos, async (req, res) => {
        const resultado = await cmfModel.cmfSubidos(req.body.codigo);
        res.send(resultado);
    });

    /* GET SINGLE POST BY ID */
    app.get(
        "/edit/:id",
        [isLoggedInMiddleware, isAdminMiddleware],
        async (req, res) => {
            // const { id } = req.params;
            const user = await User.findById(
                req.params.id,
                function (err, centro) {
                    if (err) {
                        loger(`Error edit1: ${err}`, "err");
                    } else {
                        res.render("centros_edit", { centro });
                    }
                }
            );
        }
    );

    function isLoggedInMiddleware(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect("/");
    }

    function isAdminMiddleware(req, res, next) {
        if (isAdmin(req.user)) {
            return next();
        }
        res.redirect("/");
    }

    function isAdmin(user) {
        return ["admin"].includes(user.role);
    }
};

function rutaBaseDeDatos(req, res, next) {
    const token = req.headers["access-token"];
    if (token) {
        jwt.verify(token, process.env.KEY, (err, decoded) => {
            if (err) {
                return res.json({ mensaje: "No es la autorizacion correcta" });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.send({
            mensaje: "No autorizado por el sistema.",
        });
    }
}
