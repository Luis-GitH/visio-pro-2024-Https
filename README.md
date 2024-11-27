# NOTAS VERSION 2024

## **Arranque con pm2**

pm2 start ecosystem.config.js --env desarrollo

pm2 start ecosystem.config.js --env produccion

## **Notas de MariaDB**

### create user

CREATE USER 'visiona'@localhost IDENTIFIED BY '1337';
GRANT USAGE ON *.* TO 'visiona'@localhost IDENTIFIED BY '1337';
GRANT USAGE ON *.* TO 'visiona'@localhost IDENTIFIED BY '1337';
GRANT ALL ON *.* TO 'visiona'@localhost IDENTIFIED BY '1337';
FLUSH PRIVILEGES;

### **Copia seguridad base de datos**

mariadb-dump -u USUARIO -p NOMBRE_BD > ./dbs.sql

### **Importar copia**

mysql -u visiona -p centros < dbs.sql;

mysql -u visiona -p centros < dbs.sql;