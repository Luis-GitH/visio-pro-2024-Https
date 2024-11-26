
const f = require('../../modules/funcionesLog')
pool = require("../../config/db");
var moment = require('moment'); // require
const date_ES = "YYYY-MM-DD HH:mm:ss";

module.exports = {
  //////////// findAll() ////////////////////////
  async findAll() {
    let conn;
    let rows;
    try {
      conn = await pool.fetchConn();
      const sql = "SELECT * FROM cmfs";
      rows = await conn.query(sql);
    } catch (err) {
      f.loger(`error en cmfs.findAll():, ${err.text}`);
    } finally {
      if (conn) conn.end();
    }
    return rows;
  },

  async subidos() {
    let conn;
    let rows;
    try {
      conn = await pool.fetchConn();
      const sql = `SELECT centroCmf AS codigo,  
	                   (SUBSTRING_INDEX(SUBSTR(cmf FROM 14 FOR 40), '_0', 1)) AS nombreCentro,
	                   COUNT(IF( mes ='2023-10',mes, NULL)) AS cmf2023,
	                    COUNT(IF(mes='2024-10',mes, NULL)) as cmf2024
                  FROM cmfs
                  GROUP BY centroCmf`;
      rows = await conn.query(sql);
    } catch (e) {
      f.loger(`Error en Cmf.subidos() ${e.text}`)
    } finally {
      if (conn) conn.end();
    }
    return rows;
  },

  async cmfSubidos(academia) {
    let conn;
    let result = 'no';
    let rows
    try {
      conn = await pool.fetchConn();
      const sql = `SELECT mes FROM cmfs WHERE centroCmf = '${academia}'`;
      const rows = await conn.query(sql);
      if (rows) {
        if (rows.length == 2) {
          result = 'Ok';
        } else if (rows.length == 1) {
          result = 'Solo:' + rows[0].mes;
        }
      }
    } catch (e) {
      result = 'error' //' 'error de consulta';
    } finally {
      if (conn) conn.end();
    }
    return result;
  },

  async Delete(excel) {
    let conn;
    try {
      conn = await pool.fetchConn();
      const res = await conn.query("DELETE FROM cmfs WHERE cmf = '" + excel + "'");
      f.loger(`cmf.DELETE info', ${excel} - ${JSON.stringify(res)} `, 'c');
    } catch (e) {
      f.loger(`Error en cmf.DELETE', ${e.text}`);
    }finally{
      if (conn) conn.end();
    }
  },
  ///////////// addCmf() /////////////////////////////
  async addCmf(newCmf) {
    let conn;
    let values = '"' + newCmf.join('", "') + '"';
    let sql = `INSERT INTO cmfs (centro, centroCmf, cmf, mes, estado, fecha) VALUES ( ${values} ) ON DUPLICATE KEY UPDATE centro='${newCmf[0]}',centroCmf='${newCmf[1]}' , estado='Subido de nuevo', fecha='${newCmf[5]}'`;
    try {
      conn = await pool.fetchConn();
      const res = await conn.query(sql);
      // f.loger(`cmf.addCmf( ${newCmf[1]}) info: ${JSON.stringify(res)}`, 'c'); 
    } catch (e) {
      f.loger(`CMF addCmfd() NO funciona
            SQL: ${sql} 
            ${e}`);
     
    }finally{
      if (conn) conn.end();
    }
   
  }
}

