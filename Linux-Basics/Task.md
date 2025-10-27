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


## commands-list

```
# to disable ipv5 using sysctl temporarily
sudo sysctl -w net.ipv6.conf.all.disable_ipv6=1
sudo sysctl -w net.ipv6.conf.default.disable_ipv6=1
sudo sysctl -w net.ipv6.conf.lo.disable_ipv6=1

```
sudo vi /etc/sysctl.conf #configuration file
sudo sysctl -p # To apply changes 

```
# verification

sysctl net.ipv6.conf.all.disable_ipv6
sysctl net.ipv6.conf.default.disable_ipv6

# if we get 1 in the output,then it confirms that ipv6 is disabled at runtime
```

sudo cat /etc/default/grub --> 
sudo update-grub --> update grub configuration

sudo reboot
cat /proc/cmdline

```
sudo apt update
sudo apt install firewalld -y
sudo systemctl enable firewalld
sudo systemctl start firewalld
sudo systemctl status firewalld

```

`sudo firewall-cmd --permanent --add-port=10022/tcp`

`sudo firewall-cmd --permanent --remove-service=ssh`

`sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="192.168.1.0/24" reject'`

`sudo firewall-cmd --permanent --add-service=nfs` --> Allow nfs service
`sudo firewall-cmd --reload`
sudo firewall-cmd --list-all
```
sudo firewall-cmd --list-services
sudo firewall-cmd --list-ports

```

`sudo firewall-cmd --list-rich-rules`
`sudo aa-status` --> check app armor status
```
sudo systemctl stop apparmor
sudo systemctl disable apparmor
```

`sudo grep -i "^Port" /etc/ssh/sshd_config` --> To view ssh daemon config file
sudo ss -tlnp | grep sshd

sudo vim /etc/ssh/sshd_config

