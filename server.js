'use strict';

var app = require('./src/app.js');

require('greenlock-express')
    .init({
        packageRoot: __dirname,

        // contact for security and critical bug notices
        maintainerEmail: "salva.lopezg@yahoo.com",

        // where to look for configuration
        configDir: './greenlock.d',

        // whether or not to run at cloudscale
        cluster: false,

        notify: function (event, details) {
            switch (event) {
              case "renew":  // Notificación de renovación exitosa
                console.log("Certificado renovado:", details);
                break;
        
              case "error":  // Notificación de error
                console.error("Error con el certificado:", details);
                break;
        
              case "warning":  // Advertencia sobre la proximidad a la expiración
                console.warn("Advertencia del certificado:", details);
                break;
        
              default:
                console.log("Evento desconocido:", event, details);
                break;
            }
        }
    })
    // Serves on 80 and 443
    // Get's SSL certificates magically!
    .serve(app);
