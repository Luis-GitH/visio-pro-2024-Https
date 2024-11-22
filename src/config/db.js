const f = require('../modules/funcionesLog.js');
const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: 100,
  idleTimeout:100,
});

module.exports = {
  async fetchConn() {
    let conn = await pool.getConnection();
    
    // f.loger(`Total conn/Actives/Idles: ${pool.totalConnections()} ${pool.activeConnections()} ${pool.idleConnections()}`,'t');

    return conn;
  }
};
