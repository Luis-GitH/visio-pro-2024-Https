module.exports = {
    apps: [
        {
            name: "visiona",
            script: "./server.js",
            watch: "./src",
            
            watch_delay: 1000, // Delay between restart
            // excluidos del restart
            ignore_watch: ["/node_modules", "*.ejs"],
            // "ejemplo": ["test/*", "docs/*"],
            
            log_date_format: "YYYY-MM DD  HH:mm:ss", 
            error_file: "./logs/err.log", // se colocan debajo de: user/.pm2/logs/Archivo para errores
            out_file: "./logs/out.log", 
            time: true, // Incluir la hora en los logs
            
            // variables de entorno para la app
            // argumento --env parametro  env_parametro
            env: { // no argumentos ejecuta este
                NODE_ENV: "desarrollo", // Variables de entorno para desarrollo
                // poner las diferentes variables de entorno,
                // DB_HOST: "localhost",
            },
            
            env_production: { //pm2 start ./src/config/ecosystem.config.js --env production
                
                NODE_ENV: "produccion", // Variables de entorno para producción
                // API_KEY: "abcdef",
                // DB_HOST: "db-servidor",
            },
        },
    ],
};
