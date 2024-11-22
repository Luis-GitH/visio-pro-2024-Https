CREATE DATABASE centros;

CREATE TABLE `cmfs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `centro` varchar(8) DEFAULT NULL,
  `cmf` varchar(100) DEFAULT NULL,
  `mes` varchar(15) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `cmf` (`cmf`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `logins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `centro` varchar(8) NOT NULL,
  `nombreCentro` varchar(50) NOT NULL,
  `accion` varchar(50) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `clave` varchar(255) DEFAULT NULL,
  `codigo` varchar(8) DEFAULT NULL,
  `director` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `movil` varchar(30) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `nombreCentro` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `alcanceMensual_2021` (
  `centro` varchar(50) NOT NULL DEFAULT '',
  `materia` varchar(1) NOT NULL,
  `alumno` varchar(100) NOT NULL,
  `nivelInicio` varchar(10) DEFAULT NULL,
  `2019_11` varchar(10) DEFAULT NULL,
  `2019_12` varchar(10) DEFAULT NULL,
  `2020_01` varchar(10) DEFAULT NULL,
  `2020_02` varchar(10) DEFAULT NULL,
  `2020_03` varchar(10) DEFAULT NULL,
  `2020_04` varchar(10) DEFAULT NULL,
  `2020_05` varchar(10) DEFAULT NULL,
  `2020_06` varchar(10) DEFAULT NULL,
  `2020_07` varchar(10) DEFAULT NULL,
  `2020_08` varchar(10) DEFAULT NULL,
  `2020_09` varchar(10) DEFAULT NULL,
  `2020_10` varchar(10) DEFAULT NULL,
  `2020_11` varchar(10) DEFAULT NULL,
  `2020_12` varchar(10) DEFAULT NULL,
  `2021_01` varchar(10) DEFAULT NULL,
  `2021_02` varchar(10) DEFAULT NULL,
  `2021_03` varchar(10) DEFAULT NULL,
  `2021_04` varchar(10) DEFAULT NULL,
  `2021_05` varchar(10) DEFAULT NULL,
  `2021_06` varchar(10) DEFAULT NULL,
  `2021_07` varchar(10) DEFAULT NULL,
  `2021_08` varchar(10) DEFAULT NULL,
  `2021_09` varchar(10) DEFAULT NULL,
  `2021_10` varchar(10) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`centro`,`materia`,`alumno`),
  UNIQUE KEY `nkey` (`centro`,`materia`,`alumno`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8

CREATE TABLE `alcanceMensual` (
  `centro` varchar(50) NOT NULL DEFAULT '',
  `materia` varchar(1) NOT NULL,
  `alumno` varchar(100) NOT NULL,
  `nivelInicio` varchar(10) DEFAULT NULL,
  `2022_11` varchar(10) DEFAULT NULL,
  `2022_12` varchar(10) DEFAULT NULL,
  `2023_01` varchar(10) DEFAULT NULL,
  `2023_02` varchar(10) DEFAULT NULL,
  `2023_03` varchar(10) DEFAULT NULL,
  `2023_04` varchar(10) DEFAULT NULL,
  `2023_05` varchar(10) DEFAULT NULL,
  `2023_06` varchar(10) DEFAULT NULL,
  `2023_07` varchar(10) DEFAULT NULL,
  `2023_08` varchar(10) DEFAULT NULL,
  `2023_09` varchar(10) DEFAULT NULL,
  `2023_10` varchar(10) DEFAULT NULL,
  `2023_11` varchar(10) DEFAULT NULL,
  `2023_12` varchar(10) DEFAULT NULL,
  `2024_01` varchar(10) DEFAULT NULL,
  `2024_02` varchar(10) DEFAULT NULL,
  `2024_03` varchar(10) DEFAULT NULL,
  `2024_04` varchar(10) DEFAULT NULL,
  `2024_05` varchar(10) DEFAULT NULL,
  `2024_06` varchar(10) DEFAULT NULL,
  `2024_07` varchar(10) DEFAULT NULL,
  `2024_08` varchar(10) DEFAULT NULL,
  `2024_09` varchar(10) DEFAULT NULL,
  `2024_10` varchar(10) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`centro`,`materia`,`alumno`),
  UNIQUE KEY `nkey` (`centro`,`materia`,`alumno`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `estado` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `centro` varchar(8) DEFAULT NULL,
  `mes1` tinyint(1) DEFAULT NULL,
  `mes2` tinyint(1) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `centro` (`centro`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `historicoMensual` (
  `centro` varchar(50) NOT NULL DEFAULT '',
  `materia` varchar(1) NOT NULL,
  `alumno` varchar(100) NOT NULL,
  `nivelInicio` varchar(10) DEFAULT NULL,
  `mes` varchar(10) DEFAULT NULL,
  `nivel` varchar(10) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`centro`,`materia`,`alumno`),
  UNIQUE KEY `nkey` (`centro`,`materia`,`alumno`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8



-- Inicializar las bases de datos
TRUNCATE TABLE `cmfs`;
TRUNCATE TABLE `alcanceMensual`;
TRUNCATE TABLE `logins`;
TRUNCATE TABLE `users`;

-- queries de sergio

select nc, materia, count(1)
 -- hacemos el select de una subconsulta en lugar de una tabla
 from  (
 	-- Aqui buscamos los distintos niveles que ha cursado un alumno de cada materia
	 select  distinct nc, materia, nivel from historial
 ) as niveles_pasados
-- ejemplo de alumno con dos materias y varios niveles: where nc ="Armando Prados Saenz"
-- este group by es importante para poder saber cuantos niveles
-- ha pasado el alumno por materia
 group by nc, materia;
 
 
-- al crear una vista es mas facil consultar los datos
-- al hacer select * from niveles_pasados_alumno 
-- sera equivalente al select de abajo
 create view niveles_pasados_alumno as  

 select nc, materia, count(1) as niveles_pasados
 -- hacemos el select de una subconsulta en lugar de una tabla
 from  (
 	-- Aqui buscamos los distintos niveles que ha cursado un alumno de cada materia
	 select  distinct nc, materia, nivel from historial
 ) as niveles_pasados
-- ejemplo de alumno con dos materias y varios niveles: where nc ="Armando Prados Saenz"
-- este group by es importante para poder saber cuantos niveles
-- ha pasado el alumno por materia
 group by nc, materia;
 
 
 -- con esta vista ahora podemos decir: dame los alumnos de X materia que haya pasado 3 niveles o mas
 select * 
 from niveles_pasados_alumno
where niveles_pasados > 2
 