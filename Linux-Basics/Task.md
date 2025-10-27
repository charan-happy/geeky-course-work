## Server Hardening Assignment
### Question 1: Disable IPv6

Verify if IPv6 is disabled using two methods:


sysctl configuration

GRUB configuration

What is the difference between disabling IPv6 using sysctl and GRUB?


Why might one method be preferred over the other?


### Question 2: Firewall Configuration
Configure the firewall (firewalld) with the following rules:

Allow SSH on port 10022.

Allow incoming traffic for HTTP (port 80) and HTTPS (port 443).

Add a rich rule to block all incoming traffic from IP range 192.168.1.0/24.

Allow traffic for the NFS service.

Write the commands to configure these rules and list how you verified them.


### Question 3: SELinux Status

Verify if SELinux is disabled on the system.

If SELinux is enabled:


Permanently disable SELinux.

What are the commands to check?


### Question 4: SSH Port Configuration

Verify if the SSH port is configured as 10022.

If it is not set to 10022, update the SSH daemon configuration to use this port.

How do you verify the SSH port configuration after making the change?


### Question 5: Firewall Rules Verification

What is the difference between normal firewall rules and rich rules in firewalld?

Provide specific scenarios where rich rules are more beneficial than normal rules.