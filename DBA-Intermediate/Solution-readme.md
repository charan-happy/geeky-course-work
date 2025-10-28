# 🧩 MariaDB Master–Slave Replication Setup

## 📘 Overview
This guide explains how to set up, configure, and verify **Master–Slave replication** in **MariaDB**.  
Replication ensures that data from the **Master server** is automatically copied to the **Slave server** in near real-time, providing redundancy, scalability, and backup reliability.

---

## ⚙️ Environment Details

| Role   | Hostname   | IP Address     | OS / Version | Database Engine | Version |
|--------|-------------|----------------|---------------|------------------|----------|
| Master | db-master   | 172.31.16.196  | Ubuntu 22.04  | MariaDB          | 10.6     |
| Slave  | db-slave    | 172.31.28.76   | Ubuntu 22.04  | MariaDB          | 10.6     |

---

## 🧱 Step 1 — Master Server Configuration

### 1.1 Edit MariaDB Configuration
Modify `/etc/mysql/mariadb.conf.d/50-server.cnf`:

```ini
[mysqld]
server-id = 1
log_bin = /var/log/mysql/mysql-bin.log
binlog_format = ROW
expire_logs_days = 7
max_binlog_size = 100M
sync_binlog = 1
```
Restart mariadb
`sudo systemctl restart mariadb`

1.2 Create a Replication User

Login to MariaDB on the Master:

CREATE USER 'repl'@'%' IDENTIFIED BY 'Charan&99';
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%';
FLUSH PRIVILEGES;

1.3 Verify Binary Log Info
SHOW MASTER STATUS;


Example:

+------------------+----------+
| File             | Position |
+------------------+----------+
| mysql-bin.000001 | 1645     |
+------------------+----------+


Take note of the File and Position for use on the slave.

🧩 Step 2 — Slave Server Configuration
2.1 Configure MariaDB on Slave

Edit /etc/mysql/mariadb.conf.d/50-server.cnf:

[mysqld]
server-id = 2
relay_log = /var/log/mysql/mysql-relay-bin
log_error = /var/log/mysql/mysql-error.log
read_only = 1


Then create and set permissions for the log directory:

sudo mkdir -p /var/log/mysql
sudo chown -R mysql:mysql /var/log/mysql
sudo chmod 750 /var/log/mysql
sudo systemctl restart mariadb

2.2 Sync Initial Data

Dump the master database and transfer to slave:

mysqldump -u root -p usersdb > usersdb_dump.sql
sudo scp usersdb_dump.sql user@172.31.28.76:/tmp/


On Slave:

mysql -u root -p
CREATE DATABASE usersdb;
USE usersdb;
SOURCE /tmp/usersdb_dump.sql;

🔗 Step 3 — Configure Replication

On Slave:

STOP SLAVE;
RESET SLAVE ALL;

CHANGE MASTER TO
  MASTER_HOST='172.31.16.196',
  MASTER_USER='repl',
  MASTER_PASSWORD='Charan&99',
  MASTER_LOG_FILE='mysql-bin.000001',
  MASTER_LOG_POS=1645;

START SLAVE;

🧾 Step 4 — Verify Replication Status

Run:

SHOW SLAVE STATUS\G


Expected output:

Slave_IO_Running: Yes
Slave_SQL_Running: Yes
Seconds_Behind_Master: 0

🧪 Step 5 — Test Replication

On Master:

USE usersdb;
INSERT INTO users (username, email) VALUES ('Replication Test', 'test@example.com');


On Slave:

USE usersdb;
SELECT * FROM users;


✅ Expected result:

| 4 | Replication Test | test@example.com | 2025-10-28 07:15:32 |

🚨 Troubleshooting
Issue	Error	Cause	Fix
Relay log missing	File '/var/log/mysql/mysql-relay-bin.index' not found	Directory missing or permission issue	Create directory /var/log/mysql/ and set correct ownership
Same server-id	master and slave have equal server ids	Both configs use same ID	Assign different server-id
Can't connect to master	Can't connect to server (110)	Network/firewall or GRANT issue	Allow port 3306, recheck replication user
User not found	Can't find any matching row in user table	Replication user missing	Recreate user and FLUSH PRIVILEGES
Public key SSH error	Permission denied (publickey)	Wrong SSH key or username	Recheck SSH key and ownership
🧮 Useful Commands
Description	Command
Check master binary log	SHOW MASTER STATUS;
Check slave replication	SHOW SLAVE STATUS\G
Restart MariaDB	sudo systemctl restart mariadb
View relay log files	ls -l /var/log/mysql/
Insert test data	INSERT INTO users ...
Check replication lag	SHOW SLAVE STATUS\G → Seconds_Behind_Master
🛡️ Best Practices

Always assign unique server IDs.

Use a dedicated replication user with limited privileges.

Enable SSL for replication in production.

Monitor Seconds_Behind_Master for lag.

Purge old binary logs periodically:

PURGE BINARY LOGS TO 'mysql-bin.000010';
