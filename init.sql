-- init sql original

CREATE DATABASE IF NOT EXISTS `apiDB`;

-- Crear usuario para apiDB (variables de entorno expuestas)
CREATE USER 'api_user'@'%' IDENTIFIED BY 'api_password';
GRANT ALL PRIVILEGES ON apiDB.* TO 'api_user'@'%';

-- Reflejar cambios de permisos
FLUSH PRIVILEGES;

-- fin init sql original

USE apiDB;

-- Inicio dump

-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: apiDB
-- ------------------------------------------------------
-- Server version	8.4.8

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
-- Table structure for table `autor`
--

DROP TABLE IF EXISTS `autor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `autor` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombrecompleto` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `autor_nombrecompleto_unique` (`nombrecompleto`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `autor`
--

LOCK TABLES `autor` WRITE;
/*!40000 ALTER TABLE `autor` DISABLE KEYS */;
INSERT INTO `autor` VALUES (5,'Agatha Christie'),(16,'Aron Nimzowitsch'),(4,'Daniele Steel'),(11,'Edgar Allan Poe'),(7,'Franz Kafka'),(6,'J.K. Rowling'),(1,'Jorge Luis Borges'),(12,'José Hernández'),(2,'José Raúl Capablanca'),(8,'Miguel de Cervantes'),(13,'Ricardo Güiraldes'),(3,'Robert C. Martin'),(10,'Robert Greene'),(15,'Sir Arthur Conan Doyle');
/*!40000 ALTER TABLE `autor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `editorial`
--

DROP TABLE IF EXISTS `editorial`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `editorial` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `editorial_nombre_unique` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `editorial`
--

LOCK TABLES `editorial` WRITE;
/*!40000 ALTER TABLE `editorial` DISABLE KEYS */;
INSERT INTO `editorial` VALUES (2,'Alfaguara'),(3,'Anagrama'),(9,'Emecé'),(7,'Fondo de Cultura Económica'),(10,'Losada'),(5,'Paidós'),(1,'Planeta'),(6,'Siglo XXI'),(8,'Sudamericana'),(4,'Tusquets');
/*!40000 ALTER TABLE `editorial` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ejemplar`
--

DROP TABLE IF EXISTS `ejemplar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ejemplar` (
  `id` int unsigned NOT NULL,
  `mi_libro_id` int unsigned NOT NULL,
  `fecha_incorporacion` datetime NOT NULL,
  `baja_logica` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`mi_libro_id`),
  KEY `ejemplar_mi_libro_id_index` (`mi_libro_id`),
  CONSTRAINT `ejemplar_mi_libro_id_foreign` FOREIGN KEY (`mi_libro_id`) REFERENCES `libro` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ejemplar`
--

LOCK TABLES `ejemplar` WRITE;
/*!40000 ALTER TABLE `ejemplar` DISABLE KEYS */;
INSERT INTO `ejemplar` VALUES (1,1,'2026-03-29 19:51:27',0),(1,2,'2026-03-29 19:53:43',0),(1,3,'2026-03-29 20:05:41',0),(1,4,'2026-03-29 20:06:16',0),(1,5,'2026-03-29 20:06:52',0),(1,7,'2026-03-29 20:22:13',0),(1,8,'2026-03-29 20:22:56',0),(1,9,'2026-03-29 20:23:31',0),(1,11,'2026-03-29 20:24:51',0),(1,12,'2026-03-29 20:25:38',0),(1,13,'2026-03-29 20:33:16',0),(1,14,'2026-03-29 20:33:46',0),(1,15,'2026-03-29 20:34:11',0),(2,1,'2026-03-29 19:51:27',1),(2,2,'2026-03-29 21:24:46',0),(2,4,'2026-03-29 20:06:16',0),(2,5,'2026-03-29 20:06:52',0),(2,7,'2026-03-29 20:22:13',0),(2,9,'2026-03-29 21:23:26',0),(2,11,'2026-03-29 20:24:51',0),(2,13,'2026-03-29 20:33:16',0),(2,14,'2026-03-29 20:33:46',0),(3,1,'2026-03-29 21:26:41',0),(3,5,'2026-03-29 20:06:52',0),(3,7,'2026-03-29 20:53:13',0),(3,9,'2026-03-29 21:23:28',0),(3,11,'2026-03-29 20:24:51',0),(3,14,'2026-03-29 20:33:46',0),(4,1,'2026-03-29 21:26:43',0),(4,2,'2026-03-29 21:24:48',0),(5,2,'2026-03-29 21:24:49',0);
/*!40000 ALTER TABLE `ejemplar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `libro`
--

DROP TABLE IF EXISTS `libro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `libro` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  `isbn` varchar(255) NOT NULL,
  `ultimo_codigo_ejemplar` int NOT NULL DEFAULT '0',
  `mi_autor_id` int unsigned NOT NULL,
  `mi_editorial_id` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `libro_titulo_unique` (`titulo`),
  UNIQUE KEY `libro_isbn_unique` (`isbn`),
  KEY `libro_mi_autor_id_index` (`mi_autor_id`),
  KEY `libro_mi_editorial_id_index` (`mi_editorial_id`),
  CONSTRAINT `libro_mi_autor_id_foreign` FOREIGN KEY (`mi_autor_id`) REFERENCES `autor` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `libro_mi_editorial_id_foreign` FOREIGN KEY (`mi_editorial_id`) REFERENCES `editorial` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `libro`
--

LOCK TABLES `libro` WRITE;
/*!40000 ALTER TABLE `libro` DISABLE KEYS */;
INSERT INTO `libro` VALUES (1,'Mi Sistema','Los tres pilares de la aportación de Nimzovich al ajedrez son profilaxis, centralización y bloqueo. Estos temas adquirieron tanta importancia con el tiempo, que bien podrían se considerados grandes categorías estratégicas. Estas ideas capitales se convirtieron en un punto de inflexión en el enfoque del ajedrez como actividad humana. Cuando Grandes Maestros de la época creían que ya no se podía avanzar más, Nimzovich amplió con su obra los horizontes del ajedrez.','978-84-92517-12-1',4,16,6),(2,'Fundamentos del Ajedrez','Fundamentos del Ajedrez de José Raúl Capablanca es un clásico de la literatura ajedrecística que sirve de guía práctica para mejorar desde un nivel básico hasta intermedio. El libro aborda los principios esenciales, incluyendo el valor de las piezas, finales, aperturas estratégicas y lecciones de partidas magistrales.','978-84-24503-39-0',5,2,6),(3,'Ficciones','Ficciones (1944) Colección de cuentos que explora laberintos, bibliotecas infinitas y realidades alternativas. Incluye \"El jardín de senderos que se bifurcan\" y \"La lotería en Babilonia\". Una de las obras más influyentes de la literatura latinoamericana del siglo XX.','978-84-20-63312-1',1,1,1),(4,'El Aleph ','El Aleph (1949) Reúne cuentos donde lo infinito, lo eterno y lo imposible conviven con lo cotidiano. El cuento que da título al libro narra el descubrimiento de un punto del espacio que contiene todos los demás puntos del universo.','978-84-20-63311-4',2,1,1),(5,'El libro de arena','El libro de arena (1975) Último gran libro de cuentos de Borges. Narra historias donde objetos y situaciones imposibles irrumpen en la realidad: un libro sin principio ni fin, un espejo que no refleja, una secta que venera el caos.','978-84-20-63313-8',3,1,1),(6,'El Hacedor','El hacedor (1960) Obra inclasificable que mezcla poemas, parábolas y brevísimos ensayos. Borges reflexiona sobre el tiempo, la memoria, la identidad y la creación artística con una prosa depurada al extremo.','978-84-20-63333-6',0,1,10),(7,'La metamorfosis','Gregor Samsa, pequeño comerciante y único sostén de su familia, se transforma de repente en un enorme insecto. La dificultad de comunicarse con quienes lo rodean lo vuelve intolerable para su entorno, hasta un final insospechado. Considerada una de las mejores novelas cortas de todos los tiempos. ','978-1-48-021711-9',3,7,8),(8,'Don Quijote de la Mancha','Un hidalgo manchego enloquecido por los libros de caballería sale a recorrer España como caballero andante junto a su escudero Sancho Panza. Considerada la primera novela moderna y una de las cumbres de la literatura universal.','978-84-20-46728-3',1,8,8),(9,'Las 48 leyes del poder','Destila tres mil años de historia del poder en 48 leyes esenciales, basándose en las filosofías de Maquiavelo, Sun Tzu y Carl von Clausewitz. Manual definitivo para quien quiera obtener, observar o defenderse del poder absoluto. ','978-950-08-3768-2',3,10,3),(10,'Diez cuentos de terror','Selección de los diez relatos más terroríficos de Poe: \"La caída de la casa Usher\", \"El corazón delator\", \"El gato negro\" y otros. Una atmósfera macabra y enfermiza considerada entre los mejores cuentos del mundo. ','978-84-15-97390-4',0,11,6),(11,'El gaucho Martín Fierro','Poema narrativo en verso (1872) sobre un gaucho trabajador al que la injusticia social convierte en forajido. Narra el carácter independiente y sacrificado del gaucho, y protesta contra el reclutamiento forzoso impuesto por el presidente Sarmiento. ','978-1-54-064073-4',3,12,7),(12,'Don Segundo Sombra','Novela rural argentina (1926) narrada en primera persona. Evoca al gaucho como figura legendaria a través del viaje iniciático del joven Fabio junto al resero Don Segundo, aprendiendo el valor, el honor y la lealtad de la vida pampeana. ','978-987-11-3621-6',1,13,2),(13,'Las aventuras de Sherlock Holmes','Doce historias publicadas originalmente en The Strand Magazine entre 1891 y 1892, consideradas la piedra angular del canon holmesiano. El propio autor las catalogó como sus relatos favoritos. ','978-84-75-61853-1',2,15,5),(14,'Estudio en escarlata','Primera aparición de Sherlock Holmes. El detective más famoso de la literatura se enfrenta a su primer gran caso junto al Doctor Watson, desplegando su extraordinario sentido de la observación y capacidad deductiva para resolver un oscuro crimen. ','978-84-91-05009-4',3,15,5),(15,'El sabueso de los Baskerville','Holmes y Watson viajan a Dartmoor para resolver el asesinato de Sir Charles Baskerville, muerto en circunstancias extrañas. A caballo entre el relato de misterio y el cuento de terror, supuso el regreso triunfal de Sherlock Holmes. ','978-84-15-61882-9',1,15,4);
/*!40000 ALTER TABLE `libro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `linea_prestamo`
--

DROP TABLE IF EXISTS `linea_prestamo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `linea_prestamo` (
  `orden_linea` int unsigned NOT NULL,
  `mi_prestamo_id` int unsigned NOT NULL,
  `fecha_devolucion_teorica` date NOT NULL,
  `fecha_devolucion_real` date DEFAULT NULL,
  `mi_ejemplar_id` int unsigned NOT NULL,
  `mi_ejemplar_mi_libro_id` int unsigned NOT NULL,
  PRIMARY KEY (`orden_linea`,`mi_prestamo_id`),
  KEY `linea_prestamo_mi_prestamo_id_index` (`mi_prestamo_id`),
  KEY `linea_prestamo_mi_ejemplar_id_mi_ejemplar_mi_libro_id_index` (`mi_ejemplar_id`,`mi_ejemplar_mi_libro_id`),
  CONSTRAINT `linea_prestamo_mi_ejemplar_id_mi_ejemplar_mi_libro_id_foreign` FOREIGN KEY (`mi_ejemplar_id`, `mi_ejemplar_mi_libro_id`) REFERENCES `ejemplar` (`id`, `mi_libro_id`) ON UPDATE CASCADE,
  CONSTRAINT `linea_prestamo_mi_prestamo_id_foreign` FOREIGN KEY (`mi_prestamo_id`) REFERENCES `prestamo` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `linea_prestamo`
--

LOCK TABLES `linea_prestamo` WRITE;
/*!40000 ALTER TABLE `linea_prestamo` DISABLE KEYS */;
INSERT INTO `linea_prestamo` VALUES (1,1,'2026-04-28','2026-03-29',1,1),(1,2,'2026-04-28','2026-03-29',1,5),(1,3,'2026-04-28','2026-03-29',1,8),(1,4,'2026-04-28','2026-03-29',1,12),(1,5,'2026-04-28','2026-03-29',1,15),(1,6,'2026-04-28','2026-03-29',1,14),(1,7,'2026-04-28','2026-03-29',1,15),(1,8,'2026-04-28','2026-03-29',2,1),(1,9,'2026-04-28','2026-03-29',1,8),(1,10,'2026-04-28','2026-03-29',2,11),(1,11,'2026-04-28','2026-03-29',1,12),(1,12,'2026-04-28','2026-03-29',2,5),(1,13,'2026-04-28','2026-03-29',2,2),(1,14,'2026-04-28','2026-03-29',1,2),(1,15,'2026-04-28','2026-03-29',1,8),(1,16,'2026-04-28','2026-03-29',1,12),(1,17,'2026-04-28','2026-03-29',1,5),(1,18,'2026-04-28','2026-03-29',2,4),(1,19,'2026-04-28','2026-03-29',1,2),(1,20,'2026-04-28','2026-03-29',1,2),(1,21,'2026-04-28','2026-03-29',1,9),(1,22,'2026-04-28','2026-03-29',1,12),(1,23,'2026-01-01',NULL,1,3),(2,1,'2026-04-28','2026-03-29',1,11),(2,2,'2026-04-28','2026-03-29',2,1),(2,3,'2026-04-28','2026-03-29',1,13),(2,7,'2026-04-28','2026-03-29',2,7),(2,9,'2026-04-28','2026-03-29',1,9),(2,19,'2026-04-28','2026-03-29',1,5),(2,20,'2026-04-28','2026-03-29',1,3),(2,21,'2026-04-28','2026-03-29',2,13),(2,22,'2026-04-28','2026-03-29',2,11),(2,23,'2026-01-01',NULL,2,2),(3,2,'2026-04-28','2026-03-29',2,4),(3,19,'2026-04-28','2026-03-29',2,13),(3,22,'2026-04-28','2026-03-29',3,1),(4,2,'2026-04-28','2026-03-29',2,7);
/*!40000 ALTER TABLE `linea_prestamo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `politica_biblioteca`
--

DROP TABLE IF EXISTS `politica_biblioteca`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `politica_biblioteca` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `dias_sancion_maxima` int NOT NULL,
  `dias_prestamo` int NOT NULL,
  `cant_pendientes_maximo` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `politica_biblioteca`
--

LOCK TABLES `politica_biblioteca` WRITE;
/*!40000 ALTER TABLE `politica_biblioteca` DISABLE KEYS */;
INSERT INTO `politica_biblioteca` VALUES (1,14,30,4);
/*!40000 ALTER TABLE `politica_biblioteca` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `politica_sancion`
--

DROP TABLE IF EXISTS `politica_sancion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `politica_sancion` (
  `dias_hasta` int unsigned NOT NULL,
  `dias_sancion` int NOT NULL,
  PRIMARY KEY (`dias_hasta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `politica_sancion`
--

LOCK TABLES `politica_sancion` WRITE;
/*!40000 ALTER TABLE `politica_sancion` DISABLE KEYS */;
INSERT INTO `politica_sancion` VALUES (7,3),(14,7),(21,10);
/*!40000 ALTER TABLE `politica_sancion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prestamo`
--

DROP TABLE IF EXISTS `prestamo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prestamo` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `fecha_prestamo` datetime NOT NULL,
  `estado_prestamo` varchar(255) NOT NULL DEFAULT 'PENDIENTE',
  `mi_socio_prestamo_id` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `prestamo_mi_socio_prestamo_id_index` (`mi_socio_prestamo_id`),
  CONSTRAINT `prestamo_mi_socio_prestamo_id_foreign` FOREIGN KEY (`mi_socio_prestamo_id`) REFERENCES `socio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prestamo`
--

LOCK TABLES `prestamo` WRITE;
/*!40000 ALTER TABLE `prestamo` DISABLE KEYS */;
INSERT INTO `prestamo` VALUES (1,'2026-03-29 20:56:38','FINALIZADO',1),(2,'2026-03-29 20:57:29','FINALIZADO',2),(3,'2026-03-29 20:58:12','FINALIZADO',3),(4,'2026-03-29 21:19:44','FINALIZADO',2),(5,'2026-03-29 21:20:00','FINALIZADO',2),(6,'2026-03-29 21:21:38','FINALIZADO',1),(7,'2026-03-29 21:22:36','FINALIZADO',4),(8,'2026-03-29 21:22:57','FINALIZADO',4),(9,'2026-03-29 21:23:52','FINALIZADO',5),(10,'2026-03-29 21:24:16','FINALIZADO',5),(11,'2026-03-29 21:27:44','FINALIZADO',3),(12,'2026-03-29 21:27:56','FINALIZADO',3),(13,'2026-03-29 21:28:08','FINALIZADO',5),(14,'2026-03-29 21:28:41','FINALIZADO',3),(15,'2026-03-29 21:39:34','FINALIZADO',3),(16,'2026-03-29 21:59:40','FINALIZADO',3),(17,'2026-03-29 22:15:01','FINALIZADO',3),(18,'2026-03-29 22:15:12','FINALIZADO',3),(19,'2026-03-29 22:17:44','FINALIZADO',3),(20,'2026-03-29 22:44:22','FINALIZADO',1),(21,'2026-03-29 22:45:27','FINALIZADO',1),(22,'2026-03-29 22:46:14','FINALIZADO',3),(23,'2026-03-29 23:13:28','PENDIENTE',2);
/*!40000 ALTER TABLE `prestamo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sancion`
--

DROP TABLE IF EXISTS `sancion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sancion` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `fecha_sancion` date NOT NULL,
  `dias_sancion` int NOT NULL,
  `fecha_revocacion` date DEFAULT NULL,
  `mi_socio_sancion_id` int unsigned NOT NULL,
  `mi_linea_prestamo_orden_linea` int unsigned NOT NULL,
  `mi_linea_prestamo_mi_prestamo_id` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sancion_mi_linea_prestamo_orden_linea_mi_linea_pre_adc96_unique` (`mi_linea_prestamo_orden_linea`,`mi_linea_prestamo_mi_prestamo_id`),
  KEY `sancion_mi_socio_sancion_id_index` (`mi_socio_sancion_id`),
  CONSTRAINT `sancion_mi_linea_prestamo_orden_linea_mi_linea_pr_0970a_foreign` FOREIGN KEY (`mi_linea_prestamo_orden_linea`, `mi_linea_prestamo_mi_prestamo_id`) REFERENCES `linea_prestamo` (`orden_linea`, `mi_prestamo_id`) ON UPDATE CASCADE,
  CONSTRAINT `sancion_mi_socio_sancion_id_foreign` FOREIGN KEY (`mi_socio_sancion_id`) REFERENCES `socio` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sancion`
--

LOCK TABLES `sancion` WRITE;
/*!40000 ALTER TABLE `sancion` DISABLE KEYS */;
INSERT INTO `sancion` VALUES (1,'2026-03-29',3,'2026-03-29',3,1,16),(2,'2026-03-29',3,'2026-03-29',3,1,17),(3,'2026-03-29',3,'2026-03-29',3,1,18),(4,'2026-03-29',3,'2026-03-29',3,1,19),(5,'2026-03-29',3,'2026-03-29',3,2,19),(6,'2026-03-29',3,'2026-03-29',3,3,19),(8,'2026-01-01',3,NULL,1,2,20),(9,'2026-01-01',3,NULL,1,1,21),(10,'2026-01-01',3,NULL,1,2,21),(11,'2026-01-01',3,NULL,3,1,22),(12,'2026-01-01',3,NULL,3,2,22),(13,'2026-01-01',3,NULL,3,3,22),(14,'2026-03-29',3,NULL,1,1,1),(15,'2026-03-29',3,NULL,1,2,1);
/*!40000 ALTER TABLE `sancion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `socio`
--

DROP TABLE IF EXISTS `socio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `socio` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `domicilio` varchar(255) NOT NULL,
  `telefono` varchar(255) NOT NULL,
  `baja_logica` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `socio`
--

LOCK TABLES `socio` WRITE;
/*!40000 ALTER TABLE `socio` DISABLE KEYS */;
INSERT INTO `socio` VALUES (1,'Jorge Luis','Montini','Av. Oroño 15000','3364292929',0),(2,'Silvana Lujan','Denicola','Av. Oroño 15000','3364313131',0),(3,'Agostino','Montini','Leon guruciaga 10000','3364889088',0),(4,'Santiago','Gerez','Av. Viale 1500','341707070',1),(5,'Federico','Ariano','Echague 40000','3364010101',0),(6,'Francisco','Liberati','Almafuerte 200','3364662121',0);
/*!40000 ALTER TABLE `socio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `rol` varchar(255) NOT NULL,
  `baja_logica` tinyint(1) NOT NULL DEFAULT '0',
  `mi_socio_id` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_email_unique` (`email`),
  UNIQUE KEY `user_mi_socio_id_unique` (`mi_socio_id`),
  CONSTRAINT `user_mi_socio_id_foreign` FOREIGN KEY (`mi_socio_id`) REFERENCES `socio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin@hotmail.com','$2b$10$hfiA0f7aY0nYsfMA8.NNG.B5QOkXte/AGQ1YQmOzKAVFenfcIwISi','ADMIN',0,NULL),(2,'admin2@hotmail.com','$2b$10$oOa1.DPito6LZIuQXMNHr.QvBVtu47wBYT2SopvJ7Bgk3ew1TiRaS','ADMIN',0,NULL),(3,'jorge@hotmail.com','$2b$10$0uq5Kk4V1S4GCqoD72//jem6ZDdeyNhakziAjdf4pd3QWv9sPKADm','USER',0,1),(4,'silvana@hotmail.com','$2b$10$TZIy5beQpGQ5XEhXrtbHc.B1fhN0kVG2aMLCG9ZfIAg.I86/f7F9O','USER',0,2),(5,'agosmontini@hotmail.com','$2b$10$HPchEc3T2HwdqZhsXAusUOM356tWag41aYiIwBrDwCGr9PKFIoRwK','USER',0,3),(6,'santi@hotmail.com','$2b$10$mOxHN2GLKjgXb8K2H06sB.IFXG8kTTXBcdqQrdy9i6MyCPr/a94bC','USER',1,4),(7,'fedeAriano@hotmail.com','$2b$10$QkPUMBi.PBx05GPwc/x3A.LdJpP6G6NY/llOvpT8GaweeINJli8vm','USER',0,5),(8,'franLiberati@hotmail.com','$2b$10$P8oeqQ5pG8DfR8FPN9z4bubS2Sq0Z2Cxgpz4ZbPUBy7BqsovCLMcS','USER',0,6);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-29 21:06:31
