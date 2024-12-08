const dayjs = require("dayjs"); // require
const fs = require("fs");

function fechaLog(inputDate) {
    // Determinar la fecha a usar
    const retFecha = inputDate ? dayjs(inputDate) : dayjs(); // Usar fecha proporcionada o la actual
    return retFecha.format("YYYY-MM-DD HH:mm:ss");
}
// func = 'd'-> database.log, 'l' general 'x' csv
/**
 * Función para escribir en el loger en el directorio de logs
 * 
 * @param {string} log - db: databases.log,
        err: errores.log,
        trace: trace.log,
        niveles: alcanceMes.log,
        cmf: cmfs.log,
        user: users.log,
        login: logins.log,
        info: info.log;
*/
function loger(texto, log) {
    const fecha = dayjs().format("YYYY/MM/DD HH:mm:ss "),
        db = "logs/databases.log",
        er = "logs/errores.log",
        trace = "logs/trace.log",
        niveles = "logs/AlcanceMes.log",
        cmf = "logs/cmfs.log",
        user = "logs/users.log",
        login = "logs/logins.log",
        info = "logs/info.log";

    try {
        switch (log) {
            case "cmf": // cmf Log
                fs.appendFileSync(cmf, fecha + " " + texto + `\n`);
                break;

            case "db": // database log
                fs.appendFileSync(db, `${fecha}  ${texto} \n`);
                break;

            case "user": // model.user log
                fs.appendFileSync(user, `${fecha}  ${texto} \n`);
                break;

            case "niveles": // AlcanceMes Log
                fs.appendFileSync(niveles, `${fecha}  ${texto} \n`);
                break;

            case "login": // Login Log
                fs.appendFileSync(login, `${fecha}  ${texto} \n`);
                break;

            case "trace": // trace log para seguimiento de valores
                fs.appendFileSync(trace, `${fecha}  ${texto} \n`);
                break;
            case "info":
                fs.appendFileSync(info, `${fecha}  ${texto} \n`);
                break;
            default: // los errores de todos
                fs.appendFileSync(er, `${fecha}  ${texto} \n`);
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

module.exports = { fechaLog, loger }; //, getNivel: getNivel };
