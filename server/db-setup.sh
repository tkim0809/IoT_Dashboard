# needs to run with superuser access
# currently untested until I can set up a Linux VM
apt update;
apt install mysql-server;
systemctl start mysql.service;
#mysql_secure_installation;
mysql -u root -- force < db-config.sql