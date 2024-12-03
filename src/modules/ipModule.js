require("dotenv").config();
const process = require("process");
const axios = require("axios");
const nodemailer = require("nodemailer");
const fs = require("fs");
const f = require("./funcionesLog.js");

const env_node = process.env.NODE_ENV || "produccion"; // produccion||desarrollo
f.logear("ARRANQUE:", `nuevo proceso en ${env_node}`);

let eMailDestino = "";
if (env_node === "produccion") {
    eMailDestino = process.env.MAIL_AVISOS_PRODUCCION;
} else {
    eMailDestino = process.env.MAIL_AVISOS_DESARROLLO;
}

const eMailOrigen = process.env.MAIL_ORIGEN;
const eMailPassword = process.env.MAIL_PASS;

let lastIP = "";

// Función para obtener la IP pública
async function getPublicIP() {
    try {
        const response = await axios.get("https://api.ipify.org?format=json");
        return response.data.ip;
    } catch (error) {
        console.error("Error al obtener la IP:", error);
        f.logear("NO SE OBTIENE LA IP pubñica");
        return null;
    }
}

// Función para enviar correo
async function sendEmail(newIP) {
    let transporter = nodemailer.createTransport({
        service: "yahoo",
        auth: {
            user: eMailOrigen,
            pass: eMailPassword,
        },
    });

    let mailOptions = {
        from: eMailOrigen,
        to: eMailDestino,
        subject: "Cambio de IP pública",
        text: `Ha cambiado la IP de visiona.pro, la nueva IP es: ${newIP}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        f.loger("CAMBIO IP: ", `Se ha cambiado la IP la nueva es: ${newIP}`);
    } catch (error) {
        f.loger("ERROR: Error al enviar correo de cambio de IP", error);
    }
}

// Función principal
async function checkIP() {
    console.log("psamos");
    const currentIP = await getPublicIP();
    if (fs.existsSync("lastIP.txt")) {
        lastIP = fs.readFileSync("lastIP.txt", "utf8");
    }
    if (currentIP && currentIP !== lastIP) {
        console.log(`IP cambiada: ${currentIP}`);
        await sendEmail(currentIP);
        lastIP = currentIP;

        try {
            fs.writeFileSync("lastIP.txt", currentIP, "utf8");
            console.log("Archivo escrito exitosamente");
        } catch (error) {
            console.error("Error al escribir el archivo:", error.message);
        }
    }
}

// Cargar la última IP conocida
if (fs.existsSync("lastIP.txt")) {
    lastIP = fs.readFileSync("lastIP.txt", "utf8");
}

// Ejecutar la verificación cada 30 minutos
setInterval(checkIP, 1 * 60 * 1000);

// Ejecutar una vez al inicio
// checkIP();
module.exports = { checkIP: checkIP };
