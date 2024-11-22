const process = require('process');
console.log(new Date().toISOString(), 'process.env.NODE_ENV=', process.env.NODE_ENV)
const env_node = process.env.NODE_ENV || "prod"; // prod||dev

const XLSX = require("xlsx");
const f = require("./funcionesLog.js");
const fs = require('fs');
var crypto = require('crypto');
const moment = require('moment');
const date_ES = "YYYY-MM-DD HH:mm:ss";

const nivelModel = require('../app/models/alcanceMensual');
const CmfModel = require('../app/models/cmf');
const UPLOAD = "upload/";
const PROCESADOS = "procesados/";

const modulo = Array(
    ["Alumno (Matemáticas)", "Alumno (Lectura)", "Alumno (EFL)"],
    ["M", "L", "E"],
    ["MATEMATICAS", "LECTURA", "ENGLISH"]
);
const headCentro = "HEADERCENTERNUMBER";
const columnas1 = [2, 35, 84, 21, 28, 99];

// procesarUpload() procesamos los archivos subidos al directorio UPLOAD;
function procesarUpload(user, archivosAtratar) {
    if (archivosAtratar) {
        fs.readdir(UPLOAD, function (err, archivos) {
            if (err) { onError(err); return; }
            archivos.forEach(archivo => {
                if (archivosAtratar.includes(archivo)) { // verificamos que esta en la lista importada
                    try {
                        importaAlcanceMensual(UPLOAD, PROCESADOS, archivo);
                    } catch (error) {
                        console.log(new Date().toISOString(), error)
                    }
                }
            });
        });
    } else {
        console.log(new Date().toISOString(), 'sin archivos que tratar del usuario: ', user)
    }
}

// procesarTodoUpload() procesamos todos los archivos del directorio UPLOAD;
async function procesarTodoUpload() {
    let resultado = 0;
    fs.readdir(UPLOAD, function (err, archivos) {
        if (err) { onError(err); return; }
        archivos.forEach(archivo => {
            if (archivo.substring(0, 3) === 'CMF') {
                const i = archivo.lastIndexOf('_2') + 1
                const yearMes = archivo.substring(i, i + 4) + '-' + archivo.substring(i + 4, i + 6)
                cmfArr =
                    ['upload', // quien lo sube
                        archivo.substring(4, 12),    // centroCmf que se ha logueado
                        archivo,
                        yearMes,
                        'Subido',
                        moment().format(date_ES),
                    ];
                try {
                    CmfModel.addCmf(cmfArr);
                } catch (e) {
                    console.log(new Date().toISOString(), 'error en import', archivo, e);
                }
                try {
                    importaAlcanceMensual(UPLOAD, PROCESADOS, archivo);
                    resultado++;
                } catch (error) {
                    console.log(new Date().toISOString(), error)
                }
            } else {
                console.log(new Date().toISOString(), 'no es cmf', archivo);
            }
        });


    });
    return resultado;
}
/*************************************************************************************** 
 esta funcion importa los datos de alcance mensual de cada alumno de los tres motores
****************************************************************************************/
async function importaAlcanceMensual(upload, procesados, sLibro) {
    // upload directorio de origen CMFs subidos
    // procesados directorio donde dejamos los CMFs procesados
    // ver si es el cmf de 2020-10 0 2021-10
    let bDebug = true;
    var aMeses = ["202310", "202410"];
    const excel = sLibro;
    var alcance = "";
    const i = excel.indexOf("_202") + 1;
    const mes = excel.substring(i, i + 6);

    if (aMeses.indexOf(mes) != -1) {
        // es okey dentro de rango identificamos año 2020 o 2021
        alcance = mes.slice(0, 4);
    } else {
        return;
    }

    // validado el nombre empezamos //
    try {
        var wb = XLSX.readFile(upload + sLibro);
    } catch (e) {
        console.log(new Date().toISOString(), "no se cargo el libro: ", upload + sLibro);
        return;
    }
    for (let im = 0; im < modulo[0].length; im++) {
        const ws = wb.Sheets[modulo[0][im]];
        if (ws == undefined) {
            f.loger(`En '${sLibro}' 
            no está la hoja: ${modulo[0][im]}`);
            continue;
        }
        if (ws == undefined) return; // no hay mas hojas
        const sCentro = ws["P7"].v;
        // comenzamos la importacion
        if (bDebug) console.log(new Date().toISOString(),
            "Excel a tratar:",
            sLibro,
            ", hoja:",
            modulo[0][im],
            " Centro:",
            sCentro
        );
        let xCentro;
        // console.log(new Date().toISOString(),'env_node: ', env_node);
        if (env_node === "prod") {
            // console.log(new Date().toISOString(),'scentro estamos en produccion');
            xCentro = crypto.createHash('md5').update(sCentro).digest('hex');
        } else {
            console.log(new Date().toISOString(), 'estamos en desarrollo');
            xCentro = sCentro;
        }
        // fila 15 cabecera de meses
        const mesHeader = Array(
            "AN",
            "AR",
            "AV",
            "AZ",
            "BD",
            "BH",
            "BL",
            "BP",
            "BT",
            "BX",
            "CB",
            "CF"
        );


        var data = [];
        var tmp = [];
        var regex = /\d+[A-Z]|[A-Z]+/ig;
        let nknombre;
        for (let i = 16; i < 900; i += 2) {
            try {
                nknombre = ws["B" + i].v;
                if (nknombre === "BAJAS DE ALUMNOS:") continue;
                if (nknombre === "") break;
                if (env_node === "prod") {
                    nknombre = crypto.createHash('md5').update(nknombre).digest('hex');
                }
            } catch (e) {
                // f.loger(e.text)
                // f.loger(`Error en: ${sLibro}, hoja: ${modulo[1][im]}, celda: B${i}, nknombre typo ${typeof nknombre}`)
                // salimos no hay nombre válido hemos llegado al final
                break;
            }
            try {
                tmp = ws["AI" + i].v
                tmp = tmp.match(regex);
                nKinicio = tmp;
            } catch (e) {
                if (bDebug) console.log(new Date().toISOString(), e.text)
                nKinicio = " ";
            }
            var n = 0,
                aMes = [];
            // Hacemos los meses
            mesHeader.forEach(function (mes) {
                // separamos el nivel de los números
                try {
                    switch (process.env.TABLET) {
                        case "0":
                            // se extraen los alumnos sin tablet hojas > 0
                            if (ws[mes + (i + 1)].v > 0) {
                                tmp = ws[mes + i].v;
                                tmp = tmp.match(regex);
                            } else {
                                tmp = " "
                            }
                            break;
                        case "1":
                            // se extraen los alumnos con tablet hokas consumidas = 0
                            if (ws[mes + (i + 1)].v > 0) {
                                tmp = " "
                            } else {
                                tmp = ws[mes + i].v;
                                tmp = tmp.match(regex);
                            }
                            break;
                        case "2":
                            // se extraen todos los alumnos
                            tmp = ws[mes + i].v;
                            tmp = tmp.match(regex);
                            break;
                        default:
                            // esto es un error 
                            console.log(new Date().toISOString(), "error en variable de entorno: TABLET. no definida")
                            tmp = " ";
                            break;
                    }

                } catch (e) {
                    if (bDebug) {
                        console.log(new Date().toISOString(), e.text)
                        console.log(new Date().toISOString(), 'en:', sLibro, ' hoja:', modulo[0][im], 'celda:' + mes + i, ' tipo: ', typeof tmp)
                    }
                    tmp = " ";
                }
                aMes[n] = tmp
                if (bDebug) console.log(new Date().toISOString(), 'aMes[', n, ']:' + aMes[n])
                n++;
            });
            if (aMes.length > 0) {
                data = [];
                data = [xCentro, modulo[1][im], nknombre, nKinicio, ...aMes];
                data.push(moment().format(date_ES))
                //////// actualizamos la base de datos de alcanceMensual
                nivelModel.alcanceMesUpdate(alcance, data);
            }
        }
    }
    // aqui rename
    try {
        fs.renameSync(upload + sLibro, procesados + sLibro);
    } catch (error) {
        f.loger(error)
    }
}

/******************************************************************* 
 esta funcion importa los datos de SQL a Excel para las medias
********************************************************************/
async function sql2excel() {
    /* Export table to XLSX */
    var wb = XLSX.utils.book_new();

    async function book_append_table(wb, nameSheet, materia) {
        var rows = await nivelModel.queryWhere(`Materia =  '${materia}'`);
        var ws = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.book_append_sheet(wb, ws, nameSheet);
    }
    for (z = 0; z < modulo[1].length; z++) {
        await book_append_table(wb, modulo[2][z], modulo[1][z]);
    }
    XLSX.writeFile(wb, "mysql2excel.xlsx");
};

module.exports.sql2excel = sql2excel;
module.exports.procesarUpload = procesarUpload;
module.exports.procesarTodoUpload = procesarTodoUpload;
