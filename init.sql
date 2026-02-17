-- Crear DB para que el ORM cree el schema

CREATE DATABASE IF NOT EXISTS `apiDB`;

-- Crear usuario para apiDB
CREATE USER 'api_user'@'%' IDENTIFIED BY 'api_password';
GRANT ALL PRIVILEGES ON apiDB.* TO 'api_user'@'%';

-- Reflejar cambios de permisos
FLUSH PRIVILEGES;