
const f = require("../../modules/funcionesLog");
pool = require("../../config/db");

module.exports = {

  async findAll() {
    let rows;
    try {
      conn = await pool.fetchConn();
      const sql = "SELECT * FROM alcanceMensual";
      rows = await conn.query(sql);
    } catch (e) {
      f.loger('Error en alcanceMensual.findAll():' + e.text,'niveles');
      rows = e.text;
    } finally {
      if (conn) conn.end()
    }
    return rows;
  },

  /////////  Informe para el panel de control
  async resumenAlumnos() {
    let bDebug = false;
    let result = []
    const qCentros = "SELECT count(DISTINCT centro) as numero FROM alcanceMensual"
    //const qMates = "SELECT count(DISTINCT alumno) as numero FROM alcanceMensual WHERE materia='M'"
    const qMates = "SELECT COUNT(IF( materia ='M', materia, NULL)) AS numero FROM alcanceMensual"

    //const qLectura = "SELECT count(DISTINCT alumno) as numero FROM alcanceMensual WHERE materia='L'"
    const qLectura = "SELECT COUNT(IF( materia ='L', materia, NULL)) AS numero FROM alcanceMensual"
    
    //const qEnglish = "SELECT count(DISTINCT alumno) as numero FROM alcanceMensual WHERE materia='E'"
    const qEnglish = "SELECT COUNT(IF( materia ='E', materia, NULL)) AS numero FROM alcanceMensual"
    let rows;
    let conn;
    try {
      conn = await pool.fetchConn();

      rows = await conn.query(qCentros);
      result.push(rows[0].numero);
      
      rows = await conn.query(qMates);
      result.push(rows[0].numero);
      
      rows = await conn.query(qLectura);
      result.push(rows[0].numero);
      
      rows = await conn.query(qEnglish);
      result.push(rows[0].numero);
    
    } catch (err) {
      if (bDebug) f.loger('resumenAlumnos() error' + e.text, 'niveles');
      throw err;
    
    } finally {
      if (conn) conn.end();
    }
    return result;
  },

  async queryWhere(where) {
    let bDebug = false;
    let fields = ['centro', 'materia', 'alumno', 'nivelInicio', '2022_11', '2022_12', '2023_01', '2023_02', '2023_03', '2023_04', '2023_05', '2023_06', '2023_07', '2023_08', '2023_09', '2023_10', '2023_11', '2023_12', '2024_01', '2024_02', '2024_03', '2024_04', '2024_05', '2024_06', '2024_07', '2024_08', '2024_09', '2024_10'];

    let conn
    let rows;
    try {
      conn = await pool.fetchConn();
      rows = await conn.query(`SELECT ${fields} FROM alcanceMensual WHERE ${where}`);
    } catch (e) {
      if (bDebug) f.loger(`Error en queryWhere( ${where} ) con error: ${e.text}`,'niveles');
    }finally{
      if (conn) conn.end();
    }
    return rows;
  },

  async alcanceMesUpdate(alcance, data) {

    let values = '"' + data.join('", "') + '"';
    let set = "";
    let campos,
      fields,
      upFields;
    if (alcance === '2023') {
      campos = ['nivelInicio', '2022_11', '2022_12', '2023_01', '2023_02', '2023_03', '2023_04', '2023_05', '2023_06', '2023_07', '2023_08', '2023_09', '2023_10', 'fecha'];
      fields = ['centro', 'materia', 'alumno', ...campos];
      upFields = campos
    }
    if (alcance === '2024') {
      campos = ['nivelInicio', '2023_11', '2023_12', '2024_01', '2024_02', '2024_03', '2024_04', '2024_05', '2024_06', '2024_07', '2024_08', '2024_09', '2024_10', 'fecha'];
      fields = ['centro', 'materia', 'alumno', ...campos];
      upFields = campos
    }
    let n = 3;
    let coma = "', ";
    upFields.forEach(element => {
      if (element === 'fecha') coma = "'";

      set += element + " = '" + data[n] + coma;
      n++;
    });

    let conn;
    try {
      conn = await pool.fetchConn();
      await conn.query(`INSERT INTO alcanceMensual (${fields}) VALUES ( ${values} ) ON DUPLICATE KEY UPDATE ${set}`);
    } catch (e) {
      f.loger(`Error en alcanceMesUpdate: ${e.text,'niveles'}
      values: ${values}`);
    }finally{
      if (conn) conn.end();
    }
  }
}
