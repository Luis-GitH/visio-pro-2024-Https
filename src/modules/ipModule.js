require("dotenv").config();
const process = require("process");
const axios = require("axios");
const { enviarCorreo } = require("./eMailModule");
const fs = require("fs");
const f = require("./funcionesLog");

const env_node = process.env.NODE_ENV || "produccion"; // produccion||desarrollo
f.loger(`ARRANQUE DEL SERVIDOR: nuevo proceso en ${env_node}`,'info');

let lastIP = "";

// Función para obtener la IP pública
async function getPublicIP() {
    try {
        const response = await axios.get("https://api.ipify.org?format=json");
        return response.data.ip;
    } catch (error) {
        f.loger("Error al obtener la IP:" + error, 'err');
        enviarCorreo(
            "desarrollo",
            "OJO, no se puede conseguir la IP",
            "ipModule.getPublicIP"
        );
        return null;
    }
}


// Función principal
async function checkIP() {
    f.loger("Entramos en checkIP()", "trace");
    const currentIP = await getPublicIP();
    // Cargar la última IP establecida
    if (fs.existsSync("lastIP.txt")) {
        lastIP = fs.readFileSync("lastIP.txt", "utf8");
    }
    if (currentIP && currentIP !== lastIP) {
        console.log(
            `La IP anterior: ${lastIP} se ha cambiado por: ${currentIP}`
        );
        f.logear(
            "CAMBIO IP: ",
            `Se ha cambiado la IP ${OldIP} la nueva es: ${newIP}`
        );
        enviarCorreo(
            "Alerta",
            `Ha cambiado la IP del router, era: ${lastIP}, \n la nueva IP es: ${currentIP} \n Hay que cambiarla en el dominio de visiona.pro`
        );
        lastIP = currentIP;
        fs.writeFileSync("lastIP.txt", currentIP);
    }
}

// // Cargar la última IP conocida

// Ejecutar la verificación cada 5 minutos
setInterval(checkIP, 30 * 60 * 1000);

checkIP();

// Ejecutar una vez al inicio
module.exports = { checkIP };
