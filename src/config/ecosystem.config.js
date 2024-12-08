module.exports = {
    apps: [
        {
            name: "visiona",
            script: "./server.js",
            watch: "/src",
            
            watch_delay: 1000, // Delay between restart
            // excluidos del restart
            ignore_watch: ["/node_modules", "*.ejs","*.log"],
            // "ejemplo": ["test/*", "docs/*"],
            
            // log_date_format: "YYYY-MM DD  HH:mm:ss", 
            error_file: "./logs/err.log", // se colocan debajo de: user/.pm2/logs/Archivo para errores
            out_file: "./logs/out.log", 
            time: true, // Incluir la hora en los logs
            
            // variables de entorno para la app
            env_dev: {
                NODE_ENV: "development"
              },
              env_pro: {
                NODE_ENV: "production",
              }
        },
    ],
};
