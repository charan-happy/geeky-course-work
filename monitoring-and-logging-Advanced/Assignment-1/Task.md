Assignment 1: Setting up Logging with Fluentd and AWS CloudWatch
Objective: Configure a k3s cluster to forward logs to AWS CloudWatch using Fluentd.

Steps:

Deploy Fluentd as a DaemonSet in the k3s cluster.

Configure Fluentd with the out_awslogs plugin to send logs to a CloudWatch log group.

Generate application logs in the cluster and verify they are visible in the CloudWatch console.

Deliverables:

A report documenting the setup process, configurations, and screenshots of logs in CloudWatch.
