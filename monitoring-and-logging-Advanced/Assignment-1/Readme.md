# Logging Setup on k3s Using Fluent Bit and AWS CloudWatch

## Overview

This document describes the complete process for configuring log forwarding from a k3s cluster running on Ubuntu to AWS CloudWatch using Fluent Bit. The setup includes IAM configuration, Fluent Bit deployment, CloudWatch validation, and troubleshooting.

---

## Environment

* **OS:** Ubuntu
* **Kubernetes Distribution:** k3s
* **Logging Agent:** AWS for Fluent Bit
* **Cloud Provider:** AWS (CloudWatch Logs)

---

## 1. AWS IAM Configuration

### 1.1 Create IAM Policy

Create a custom policy with these CloudWatch permissions:

```
logs:CreateLogGroup
logs:CreateLogStream
logs:PutLogEvents
logs:DescribeLogGroups
logs:DescribeLogStreams
```

Use this JSON:

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:DescribeLogGroups",
        "logs:DescribeLogStreams"
      ],
      "Resource": "*"
    }
  ]
}
```

### 1.2 Create IAM User

* Create user: **fluentbit-cloudwatch-user**
* Attach the above policy
* Generate **Access Key** and **Secret Key**

### 1.3 Store Keys in Kubernetes

```
kubectl -n logging create secret generic aws-creds \
  --from-literal=aws_access_key_id=YOUR_KEY \
  --from-literal=aws_secret_access_key=YOUR_SECRET
```

---

## 2. Create Namespace

```
kubectl create namespace logging
```

---

## 3. Deploy Fluent Bit

### 3.1 Create ConfigMap

```
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluent-bit-config
  namespace: logging
data:
  fluent-bit.conf: |
    [SERVICE]
        Flush        1
        Log_Level    info

    [INPUT]
        Name              tail
        Path              /var/log/containers/*.log
        Parser            docker
        Tag               kube.*
        Refresh_Interval  5
        Mem_Buf_Limit     50MB
        Skip_Long_Lines   On

    [OUTPUT]
        Name cloudwatch_logs
        Match kube.*
        region ap-south-1
        log_group_name k3s-fluentbit-logs
        log_stream_prefix from-k3s-
        auto_create_group true

  parsers.conf: |
    [PARSER]
        Name   docker
        Format json
```

### 3.2 Deploy DaemonSet

```
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluent-bit
  namespace: logging
spec:
  selector:
    matchLabels:
      app: fluent-bit
  template:
    metadata:
      labels:
        app: fluent-bit
    spec:
      containers:
      - name: fluent-bit
        image: amazon/aws-for-fluent-bit:latest
        env:
        - name: AWS_ACCESS_KEY_ID
          valueFrom:
            secretKeyRef:
              name: aws-creds
              key: aws_access_key_id
        - name: AWS_SECRET_ACCESS_KEY
          valueFrom:
            secretKeyRef:
              name: aws-creds
              key: aws_secret_access_key
        volumeMounts:
        - name: config
          mountPath: /fluent-bit/etc/
        - name: varlog
          mountPath: /var/log
        - name: containerd
          mountPath: /var/lib/rancher/k3s/agent/containerd
      volumes:
      - name: config
        configMap:
          name: fluent-bit-config
      - name: varlog
        hostPath:
          path: /var/log
      - name: containerd
        hostPath:
          path: /var/lib/rancher/k3s/agent/containerd
```

Apply:

```
kubectl apply -f fluentbit-config.yaml
kubectl apply -f fluentbit-daemonset.yaml
```

---

## 4. Validate Deployment

### 4.1 Check Pods

```
kubectl -n logging get pods
```

Pod should show **Running**.

### 4.2 Check Fluent Bit Logs

```
kubectl -n logging logs -l app=fluent-bit
```

Expected:

* Tail input initialized
* CloudWatch output configured
* No credential or permission errors

### 4.3 Verify CloudWatch

Open CloudWatch → Log Groups → `k3s-fluentbit-logs`
You should see log streams such as:

```
from-k3s-<node-name>
```

Each stream contains logs from workloads.

---

## 5. Test Logging

Deploy test workload:

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: logger
spec:
  replicas: 1
  selector:
    matchLabels:
      app: logger
  template:
    metadata:
      labels:
        app: logger
    spec:
      containers:
      - name: logger
        image: busybox
        command: ["/bin/sh", "-c"]
        args: ['while true; do echo "$(date) test log from k3s"; sleep 5; done']
```

Logs should appear in CloudWatch shortly.

---

## 6. Troubleshooting

### No log streams in CloudWatch

* Ensure pods generate logs
* Check `/var/log/containers` on node

### Wrong region

Fluent Bit logs will show:

```
region = 'us-east-1'
```

Correct in ConfigMap if needed.

### Credentials not loaded

Inside pod:

```
kubectl -n logging exec -it fluent-bit -- env | grep AWS
```

### Permission errors

Ensure IAM user has `DescribeLogGroups` and `DescribeLogStreams`.

---

## 7. Final Output

You should have:

* CloudWatch log group: `k3s-fluentbit-logs`
* Log streams automatically created
* Real-time logs from applications inside the k3s cluster

This completes the logging setup using Fluent Bit and AWS CloudWatch on k3s.

