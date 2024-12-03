const moment = require("moment"); // require
const fs = require("fs");

// func = 'd'-> database.log, 'l' general 'x' csv
function loger(texto, log) {
    const fecha = moment().format("YYYY/MM/DD HH:mm:ss "),
        rutaDb = "log/databases.log",
        rutax = "log/errores.log",
        rutaTrace = "log/trace.log",
        rutaNiveles = "log/model.AlcanceMes.log",
        rutaCmf = "log/model.cmfs.log",
        rutaUser = "log/model.users.log",
        rutaLogin = "log/model.logins.log";

    try {
        switch (log) {
            case "c": // cmf Log
                fs.appendFileSync(rutaCmf, fecha + " " + texto + `\n`);
                break;

            case "d": // database log
                fs.appendFileSync(rutaDb, `${fecha}  ${texto} \n`);
                break;

            case "u": // model.user log
                fs.appendFileSync(rutaUser, `${fecha}  ${texto} \n`);
                break;

            case "n": // AlcanceMes Log
                fs.appendFileSync(rutaNiveles, `${fecha}  ${texto} \n`);
                break;

            case "l": // Login Log
                fs.appendFileSync(rutaLogin, `${fecha}  ${texto} \n`);
                break;

            case "t": // trace log para seguimiento de valores
                fs.appendFileSync(rutaTrace, `${fecha}  ${texto} \n`);
                break;

            default: // los errores de todos
                fs.appendFileSync(rutax, `${fecha}  ${texto} \n`);
                break;
        }
    } catch (e) {
        console.log(
            new Date().toISOString(),
            "¡OJO! Error en el loger",
            e.text
        );
    }
}

function getNivel(cadena) {
    if (cadena == "") return " ";
    for (let i = 1; i < cadena.length; i++) {
        if (cadena[i] >= 0 || cadena[i] == " ") {
            // console.log(new Date().toISOString(),"el nivel es: ", cadena.substr(0, i));
            return cadena.substr(0, i);
        }

        if (cadena.length <= 3) {
            // console.log(new Date().toISOString(),"el nivel basico es: ", cadena);
            return cadena;
        }
    }
}
function logear(tipoLog, texto) {
    const fecha = moment().format("YYYY/MM/DD HH:mm:ss "),
        rutaLogs = "log/info.log";

    try {
        fs.appendFileSync(rutaLogs, `${fecha} ${tipoLog} ${texto}\n`);
    } catch (e) {
        console.log(
            new Date().toISOString(),
            "¡OJO! Error en el loger",
            e.text
        );
    }
}
module.exports = { loger: loger, logear: logear }; //, getNivel: getNivel };
