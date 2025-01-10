CREATE DATABASE  IF NOT EXISTS `servicioCuotasDB` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `servicioCuotasDB`;
-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: servicioCuotasDB
-- ------------------------------------------------------
-- Server version	8.0.40-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cuota`
--

DROP TABLE IF EXISTS `cuota`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cuota` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `mes` int unsigned NOT NULL,
  `monto` decimal(9,3) NOT NULL,
  `fechaPago` datetime DEFAULT NULL,
  `recargoAplicado` decimal(3,2) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `idSocio` int unsigned NOT NULL,
  `idMetodoPago` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `socio_FK` (`idSocio`),
  KEY `metodo_FK` (`idMetodoPago`),
  CONSTRAINT `metodo_FK` FOREIGN KEY (`idMetodoPago`) REFERENCES `metodoPago` (`id`),
  CONSTRAINT `socio_FK` FOREIGN KEY (`idSocio`) REFERENCES `socioFinanciero` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cuota`
--

LOCK TABLES `cuota` WRITE;
/*!40000 ALTER TABLE `cuota` DISABLE KEYS */;
INSERT INTO `cuota` VALUES (3,2,750.500,NULL,0.20,'2025-01-01 12:00:00','2025-01-08 15:30:00',1,1),(4,3,750.500,NULL,0.20,'2025-01-01 12:00:00','2025-01-08 15:30:00',1,1),(5,3,750.500,NULL,0.20,'2025-01-01 12:00:00','2025-01-08 15:30:00',2,1);
/*!40000 ALTER TABLE `cuota` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `metodoPago`
--

DROP TABLE IF EXISTS `metodoPago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `metodoPago` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `codigo` varchar(15) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `metodoPago`
--

LOCK TABLES `metodoPago` WRITE;
/*!40000 ALTER TABLE `metodoPago` DISABLE KEYS */;
INSERT INTO `metodoPago` VALUES (1,'EFECTIVO',1,'2025-01-06 21:58:09','2025-01-08 13:03:41');
/*!40000 ALTER TABLE `metodoPago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `politicaRecargo`
--

DROP TABLE IF EXISTS `politicaRecargo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `politicaRecargo` (
  `diasHasta` int unsigned NOT NULL,
  `porcentaje` decimal(3,2) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`diasHasta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `politicaRecargo`
--

LOCK TABLES `politicaRecargo` WRITE;
/*!40000 ALTER TABLE `politicaRecargo` DISABLE KEYS */;
INSERT INTO `politicaRecargo` VALUES (5,0.20,'2025-01-09 23:32:38','2025-01-09 23:32:38'),(10,0.20,'2025-01-05 23:24:15','2025-01-06 12:29:06'),(15,0.20,'2025-01-10 09:23:05','2025-01-10 09:23:05');
/*!40000 ALTER TABLE `politicaRecargo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `socioFinanciero`
--

DROP TABLE IF EXISTS `socioFinanciero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `socioFinanciero` (
  `id` int unsigned NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `socioFinanciero`
--

LOCK TABLES `socioFinanciero` WRITE;
/*!40000 ALTER TABLE `socioFinanciero` DISABLE KEYS */;
INSERT INTO `socioFinanciero` VALUES (1,'2025-01-08 17:01:56','2025-01-08 17:01:56'),(2,'2025-01-08 17:02:02','2025-01-08 17:02:02');
/*!40000 ALTER TABLE `socioFinanciero` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-10 15:58:58

-- Crear DB para que el ORM cree el schema

CREATE DATABASE IF NOT EXISTS `apiDB`;

-- Crear usuario para servicioCuotasDB
CREATE USER 'cuotas_user'@'%' IDENTIFIED BY 'cuotas_password';
GRANT ALL PRIVILEGES ON servicioCuotasDB.* TO 'cuotas_user'@'%';

-- Crear usuario para apiDB
CREATE USER 'api_user'@'%' IDENTIFIED BY 'api_password';
GRANT ALL PRIVILEGES ON apiDB.* TO 'api_user'@'%';

-- Reflejar cambios de permisos
FLUSH PRIVILEGES;