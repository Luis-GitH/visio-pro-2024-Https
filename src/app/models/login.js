pool = require("../../config/db");
const f = require('../../modules/funcionesLog')

module.exports = {
  //
  async findAll() {
    let rows;
    let conn;
    try {
      conn = await pool.fetchConn();
      sql = "SELECT * FROM logins";
      rows = await conn.query(sql);
    } catch (err) {
      throw err;
    }finally{
      if (conn) conn.end();
    }
    return rows;
  },
  //
  async addLogin(newLogin) {
    let conn;
    try {
      let values = '"' + newLogin.join('", "') + '"';
      let sql = `INSERT INTO logins (centro, nombreCentro, accion) VALUES ( ${values} ) `
      conn = await pool.fetchConn();
      await conn.query(sql);
    } catch (e) {  // como existe lo actualizamos
      f.loger(`Error en addLogin() ${e}`);
    }finally{
      if (conn) conn.end();
    }
  }
}




