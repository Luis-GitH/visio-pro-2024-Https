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
        cmf: cmfs.log,
        user: users.log,
        login: logins.log,
        info: info.log;
        debug: debug.log;
*/
function loger(texto, log) {
    const fecha = dayjs().format("YYYY/MM/DD HH:mm:ss"),
        db = "logs/databases.log", // errores de accesos y consultas DataBase
        er = "logs/errores.log",
        trace = "logs/trace.log",
        cmf = "logs/cmfs.log",
        user = "logs/users.log",
        login = "logs/logins.log",
        info = "logs/info.log";
        debug = "logs/debug.log"

    try {
        switch (log) {
            case "debug": // debug Log
                fs.appendFileSync(debug, `${fecha}  ${texto} \n`);
                break;

            case "cmf": // cmf Log
                fs.appendFileSync(cmf, `${fecha}  ${texto} \n`);
                break;

            case "db": // database log
                fs.appendFileSync(db, `${fecha}  ${texto} \n`);
                break;

            case "user": // model.user log
                fs.appendFileSync(user, `${fecha}  ${texto} \n`);
                break;
           
            case "login": // Login Log de los errores
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

module.exports = { fechaLog, loger }; 
