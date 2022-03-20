CREATE DATABASE IF NOT EXISTS `srstee`;
CREATE DATABASE IF NOT EXISTS `camunda_db`;

# create proxy user and grant rights
#drop USER 'proxyuser'@'localhost';
CREATE USER IF NOT EXISTS 'proxyuser'@'%' IDENTIFIED BY 'srstee';
GRANT ALL ON *.* TO 'proxyuser'@'%';

#drop USER 'camunda_user'@'localhost';
CREATE USER IF NOT EXISTS 'camunda_user'@'%' IDENTIFIED WITH mysql_native_password BY 'srstee';
GRANT ALL ON *.* TO 'camunda_user'@'%';

FLUSH PRIVILEGES;

SET GLOBAL max_allowed_packet=1073741824;
select @max_allowed_packet;
Select @@global.max_allowed_packet;
