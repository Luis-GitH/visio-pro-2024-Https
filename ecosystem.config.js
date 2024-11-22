module.exports = {
  apps: [{
    name: "visiona",
    script: './src/server.js',
    watch: './src',
    // Delay between restart
    watch_delay: 1000,
    // excluidos
    ignore_watch: ['/node_modules', '*.ejs'],
   // "ejemplo": ["test/*", "docs/*"],
// variables de entorno para la app
    env: {
      NODE_ENV: 'dev'
    },
    env_desarrollo: {
      NODE_ENV: 'dev'
    },
    env_produccion: {
      NODE_ENV: 'prod'
    } 
  }
],
};


