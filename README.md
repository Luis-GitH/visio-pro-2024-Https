# Arranque con pm2
pm2 start ecosystem.config.js --env desarrollo
pm2 start ecosystem.config.js --env produccion

config de mailtrap.io 
/* export const transport = .createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  // config para nodemailer
    user: "b9a4d8e1c5f97e",
    pass: "30a76dc4344e2e"
}); */
create user 
CREATE USER 'visiona'@localhost IDENTIFIED BY '1337';
GRANT USAGE ON *.* TO 'visiona'@localhost IDENTIFIED BY '1337';
GRANT USAGE ON *.* TO 'visiona'@localhost IDENTIFIED BY '1337';
GRANT ALL ON *.* TO 'visiona'@localhost IDENTIFIED BY '1337';
FLUSH PRIVILEGES;
# Copia seguridad base de datos
mariadb-dump -u USUARIO -p NOMBRE_BD > ./dbs.sql
# Importar copia
mysql -u visiona -p centros < dbs.sql;

mysql -u visiona -p centros < dbs.sql