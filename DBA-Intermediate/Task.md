## Assignment 1: Setting Up Master-Slave Replication in MySQL/MariaDB
Task:

Set up a master-slave replication setup in MySQL/MariaDB (you can use virtual machines or containers for the setup).

On the master server, create a database with sample data (e.g., a simple users table).

Configure the slave server to replicate from the master.

Verify replication is working by:

Inserting new data on the master server.

Checking that the data appears on the slave.

Troubleshoot any issues (e.g., replication lag, failure to replicate, missing data) you encounter during the setup.

Deliverables:

A step-by-step report of the replication setup process.

Screenshots or logs showing data replication between the master and slave.

Troubleshooting steps taken (if any issues arose) and their resolution.

## Assignment 2: Setting Up Streaming Replication in PostgreSQL
Task:

Set up streaming replication in PostgreSQL between a primary and a standby server.

Create a sample database on the primary server and insert sample data into it.

Configure the standby server to begin streaming from the primary.

Verify replication by inserting data on the primary and ensuring it appears on the standby server.

Investigate the replication status and monitor for any potential issues.

Document the entire setup process, configuration changes, and any challenges you faced.

Deliverables:

A detailed report of the setup process including configuration files and commands used.

A working example where data from the primary is replicated to the standby server.

Screenshots or logs showing the status of replication and data consistency between primary and standby.

## Assignment 3: Monitoring and Backup of Replication
Task:

Set up cron jobs or monitoring scripts to regularly check the status of replication for both MySQL/MariaDB and PostgreSQL.

For MySQL/MariaDB, use SHOW SLAVE STATUS or equivalent commands to check for errors and replication lag.

For PostgreSQL, use pg_stat_replication and pg_stat_wal_receiver to monitor replication status.

Document how you would address replication failures or lag if it occurs during operation.

Deliverables:

Scripts or cron job configurations for monitoring replication status.

Backup procedures for both MySQL/MariaDB and PostgreSQL.