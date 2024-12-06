// const checkIP = require("./src/modules/ipModule.js");
const { enviarCorreo } =require( "./src/modules/eMailModule");

enviarCorreo(
    "info",
    "informe de subida correcto",
    "se ha enviado este mensqaje",
);


enviarCorreo(
    "produccion",
    "informe de subida correcto",
    "se ha enviado este mensqaje",
);


enviarCorreo(
    "desarrollo",
    "informe de subida correcto",
    "se ha enviado este mensqaje",
);


enviarCorreo(
    "Alerta",
    "informe de subida correcto",
    "se ha enviado este mensqaje",
);


