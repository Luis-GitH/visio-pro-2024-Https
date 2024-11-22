const f = require('../../modules/funcionesLog');
pool = require("../../config/db");
module.exports = {
  //
  async findByCodigo(codigo) {
    let conn;
    let result;
    try {
      conn = await pool.fetchConn();
      const sql = "SELECT * FROM users WHERE codigo = ?";
      const rows = await conn.query(sql, codigo);
      result = [null, rows];  // cambiado mensaje por null en [0]
    } catch (err) {
      result = [err, null];
    } finally {
      if (conn) conn.end();
    }
    return result;

  },
  //
  async findById(id) {
    let conn;
    let rows;
    try {
      conn = await pool.fetchConn();
      const sql = "SELECT * FROM users WHERE id = ?";
      rows = await conn.query(sql, id);
      if (rows.length == 1) {
        result = [null, rows];
      } else {
        result = ['Id no encontrado', null];
      }
    } catch (err) {
      result = [err, null];
    } finally {
      if (conn) conn.end()
    }
    return result;
  },
  //
  async findAll() {
    let conn;
    let rows;
    try {
      conn = await pool.fetchConn();
      const sql = "SELECT * FROM users";
      rows = await conn.query(sql);
    } catch (err) {
      f.loger(`Error en user.findAll(): ${err.text} `)
      rows = 'error';
    } finally {
      if (conn) conn.end()
    }
    return rows;
  },
  // Delete
  async Delete(codigo) {
    const bDebug = false;
    let conn;
    try {
      conn = await pool.fetchConn();
      const res = await conn.query("DELETE FROM users WHERE codigo = '" + codigo + "'");
      if (bDebug) f.loger(`user.DELETE info', ${codigo} - ${JSON.stringify(res)} `, 'u');
    } catch (e) {
      f.loger(`Error en user.DELETE', ${e.message}`);
    } finally {
      if (conn) conn.end();
    }
  },
  //
  async addUsuario(newUser) {
    const values = '"' + newUser.join('", "') + '"';
    let fields = ['clave', 'codigo', 'director', 'email', 'movil', 'nombre', 'nombreCentro', 'password', 'role', 'estado', 'fecha']
    let n = 0,
      set = "",
      coma = '", ';
    newUser[newUser.length - 2] = "Actualizado"
    fields.forEach(element => {
      if (element === 'fecha') coma = '"';
      if (element != 'codigo') set += element + ' = "' + newUser[n] + coma;
      n++;
    });
    let conn;
    let result;
    try {
      conn = await pool.fetchConn();
      const res = await conn.query(`INSERT INTO users (${fields}) VALUES ( ${values} ) ON DUPLICATE KEY UPDATE ${set}`);
      // console.log(new Date().toISOString(),res)
      switch (res.affectedRows) {
        case 1:
          f.loger(` user.addUsuario (${newUser[1]} )info: Alta`, 'u');
          result = 'Alta correcta';
          break;
        case 2:
          f.loger(` user.addUsuario (${newUser[1]} )info: Actualizado`, 'u');
          result = 'Actualizado';
          break;
      }
    } catch (e) {
      f.loger(`Error user.addUsuario( ${newUser[1]}) info: ERROR ${e.text} 
      values: ${values} 
      set: ${set}`);
      result = 'Error. Reintentar de nuevo'
    } finally {
      if (conn) conn.end();
    }
    return result;
  }
};