# NOTAS VERSION 2024

## **Arranque con pm2**

pm2 start ecosystem.config.js --env desarrollo

pm2 start ecosystem.config.js --env produccion

### comandos utiles

**pm2 stop** visiona  || **pm2 restart** visiona || **pm2 delete** visiona

**pm2 logs** visualiza los registros ||  **flush**  'borra los logs'

**pm2 describe** visiona  || **pm2 info** visiona 'da informacion con detalle del proceso '

**pm2 monit** visualiza una pantalla de monitorización

## **Notas de MariaDB**

### create user

CREATE USER 'visiona'@localhost IDENTIFIED BY '1337';
GRANT USAGE ON *.* TO 'visiona'@localhost IDENTIFIED BY '1337';
GRANT USAGE ON *.* TO 'visiona'@localhost IDENTIFIED BY '1337';
GRANT ALL ON *.* TO 'visiona'@localhost IDENTIFIED BY '1337';
FLUSH PRIVILEGES;

### **Copia seguridad base de datos**

mariadb-dump -u USUARIO -p NOMBRE_BD > ./dbs.sql

### **Importar Exportar copia**

mysql -u visiona -p centros_2024 < dbs.sql;

mysql -u visiona -p centros_2024 < dbs.sql;

SHOW DATABASES;  
SELECT user from mysql.user;  
