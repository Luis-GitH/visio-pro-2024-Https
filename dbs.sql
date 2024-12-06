-- MariaDB dump 10.19  Distrib 10.6.4-MariaDB, for osx10.16 (x86_64)
--
-- Host: localhost    Database: centros
-- ------------------------------------------------------
-- Server version	10.6.4-MariaDB

DROP TABLE IF EXISTS `alcanceMensual`;

CREATE TABLE `alcanceMensual` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

DROP TABLE IF EXISTS `cmfs`;
CREATE TABLE `cmfs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `centro` varchar(8) DEFAULT NULL,
  `centroCmf` varchar(8) DEFAULT NULL,
  `cmf` varchar(100) DEFAULT NULL,
  `mes` varchar(15) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `cmf` (`cmf`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;


CREATE TABLE `logins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `centro` varchar(8) NOT NULL,
  `nombreCentro` varchar(50) NOT NULL,
  `accion` varchar(50) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4;


-
--
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
) ENGINE=InnoDB AUTO_INCREMENT=145 DEFAULT CHARSET=utf8mb4;

--