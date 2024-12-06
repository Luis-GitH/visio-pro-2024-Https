require("dotenv").config();
const { loger } = require("./funcionesLog");
const nodemailer = require("nodemailer");

const jConfigEmail = {
    service: "yahoo",
    auth: {
        user: process.env.MAIL_ORIGEN,
        pass: process.env.MAIL_PASS,
    },
};
/**
 * Envía un correo electrónico usando Nodemailer.
 * @param {string} deQuien - info, desarrollo, produccion, Alerta.
 * @param {string} asunto - Asunto del correo.
 * @param {string} Mensaje - Texto o cuerpo del correo.
 * @param {Array<Object>} [adjuntos] - Documentos adjuntos (opcional).
 * 
 * @returns {Promise<void>} - Promesa que se resuelve si el correo se envía con éxito.

 */
async function enviarCorreo(deQuien, Asunto, Mensaje, adjuntos = []) {
    let aQuien = "";
    const From = `${deQuien}@visiona.pro <${process.env.MAIL_ORIGEN}>`;
    switch (deQuien) {
        case "info": // informacion evolucion y eventos normales
            aQuien = "salvador.lopez@outlook.com";
            break;
        case "desarrollo": // errores o cualquier detalle de mal funcionamiento
            aQuien = "salvador.lopez@outlook.com";
            break;
        case "produccion": // correo a Salva con informacióna tratar
            aQuien = "salvador.lopez@outlook.com";
            break;
        case "Alerta": // correo a Sergio y a mi por cambio de IP
            aQuien = "salvador.lopez@outlook.com";
            break;
        case defaul:
            aQuien = "salvador.lopez@outlook.com";
    }

    try {
        // Configuración del transportador de correo (SMTP)
        const transporte = nodemailer.createTransport(jConfigEmail);

        //configuramos los datos del envio
        const emailOptions = {
            from: From, // Sender address
            to: aQuien, // List of recipients
            subject: Asunto,
            text: Mensaje,
            attachments: adjuntos,
        };

        const ret = await transporte.sendMail(emailOptions);
        loger(
            `Envio de correo correcto: \n\t\t de: ${From}, \n\t\t a:${aQuien}, \n\t\t Asunto: ${Asunto}\n`,
            "info"
        );
        transporte.close();
    } catch (error) {
        loger(
            `ERROR en envio eMail: \n\t\t de: ${deQuien}, \n\t\t a:${aQuien}, \n\t\t Asunto${Asunto}, \n\t\t ${error}\n`,
            "error"
        );
    } 
}

module.exports = { enviarCorreo: enviarCorreo };
