## Kubernetes Assignments
Deploy a Simple Web Application on Kubernetes

Install a Kubernetes cluster using kubeadm or minikube.

Deploy a backend and Frontend application

Expose the pod using a Service (kubectl expose pod nginx --port=80 --type=NodePort).

Submit the output of kubectl get pods and kubectl get svc.

Deploy an Application Using a Deployment

Create a Deployment for a simple web app (use nginx).

Scale the deployment to 3 replicas using kubectl scale.

Expose the application using a NodePort service.

Submit YAML files for Deployment and Service.

Deploy a Multi-Container Application using Kubernetes

Deploy a frontend (React/Angular) and backend (Node.js/Python) using Deployments.

Expose the backend as a ClusterIP service.

Expose the frontend as a NodePort service.

Submit YAML files and service verification using kubectl get all.


## Docker Swarm Assignments
Set Up a Docker Swarm Cluster

Initialize Docker Swarm (docker swarm init).

Add a worker node (docker swarm join-token worker).

Submit the output of docker node ls.

Deploy a Simple Web Service in Docker Swarm

Deploy a Backend and Frontend app  with 3 replicas 

Verify the deployment using docker service ls and docker service ps web.

Submit screenshots of the running service.

Scaling and Updating a Service in Docker Swarm

Scale an existing service to 5 replicas (docker service scale web=5).

Update the service to use a new image version (docker service update --image nginx:latest web).

Submit outputs of docker service ls and docker service ps web.