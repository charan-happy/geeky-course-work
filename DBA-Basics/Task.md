## MySQL/MariaDB Assignments:

### Assignment 1: Database Creation and Management

Create a new MySQL/MariaDB database named CompanyDB.

Create two tables:

employees with columns: id (INT), name (VARCHAR), position (VARCHAR), salary (DECIMAL).

departments with columns: id (INT), name (VARCHAR), location (VARCHAR).

Insert at least five records in both tables.

List all the databases and all the tables in CompanyDB.


### Assignment 2: Basic SQL Queries

Write and execute the following queries:

Select all employees who have a salary greater than 50000.

Update the salary of an employee with a specific id.

Delete an employee record based on id.

Demonstrate using EXPLAIN to optimize a SELECT query.


### Assignment 3: Indexing and Performance

Create an index on the name column of the employees table.

Perform a query on the name column and observe the performance impact with and without the index.

Drop the index and explain its significance.

### Assignment 4: User and Permissions Management

Create a new MySQL/MariaDB user db_user with a password.

Grant the user full access to the CompanyDB database.

Revoke the user’s access and explain each step.

### Assignment 5: Backup and Restore

Create a backup of the CompanyDB database using mysqldump.

Restore the backup to a new database named CompanyDB_backup.

Verify that the backup and restore operations were successful.

## PostgreSQL Assignments:
### Assignment 1: Database and Table Creation

Create a new PostgreSQL database named SchoolDB.

Create two tables:

students with columns: id (SERIAL), name (TEXT), age (INT).

courses with columns: id (SERIAL), course_name (TEXT), credits (INT).

Insert at least five records in each table.

List all databases and all tables in SchoolDB.


### Assignment 2: Basic SQL Queries

Write and execute the following queries:

Select all students whose age is greater than 18.

Update a student’s age based on id.

Delete a student record based on id.

Write a query using INNER JOIN to display the students enrolled in courses.


### Assignment 3: User and Permissions Management

Create a new PostgreSQL user db_user with a password.

Grant the user read-only access to the SchoolDB database.

Revoke the user's access and explain how PostgreSQL handles user permissions.


### Assignment 4: Backup and Restore

Use pg_dump to create a backup of the SchoolDB database.

Restore the backup to a new database named SchoolDB_backup.

Verify that the backup and restore operations were successful.


### Assignment 5: Using pg_hba.conf for Authentication

Modify the pg_hba.conf file to allow local connections for the db_user user using the md5 authentication method.

Restart the PostgreSQL service and test the connection.

Explain the significance of the pg_hba.conf file in PostgreSQL security.