## 1. Multi-Container Application Deployment
Scenario:
You are tasked with deploying a simple e-commerce application using Docker Compose. The application should consist of three services:

A web service running an Nginx container that serves a static website.

A backend service running a Node.js application that handles product information and communicates with a database.

A database service running a PostgreSQL container for storing product data.

Assignment:

Define the docker-compose.yml file for the above setup.

Set up a custom network configuration to ensure that the web and backend services can communicate with each other, while isolating the database service to only be accessible by the backend.

Define environment variables for the database credentials and use a .env file to configure the backend service.

Implement proper volume management for the database to ensure that data persists even after the containers are removed or restarted.

Demonstrate how to scale the backend service using Docker Compose.

## 2. Inter-App Communication with Microservices
Scenario:
You are designing a microservices-based application for a movie streaming platform using Docker Compose. The platform consists of the following services:

frontend: A React app served by an Nginx container, which is responsible for displaying the UI.

api: A Node.js-based REST API that provides movie details and user data.

user-db: A MongoDB container for storing user information.

The frontend should be able to fetch data from the api service, and the api service should communicate with the user-db service to retrieve user-related information.

Assignment:

Write the docker-compose.yml file for the application, ensuring that each service is properly defined.

Configure inter-service communication between the frontend and api services. Make sure the api service connects to the user-db service to fetch data.

Implement network configuration such that the services can communicate by service names.

Use environment variables to store sensitive data like database credentials.

Show how to start and stop the multi-container application using Docker Compose commands.

## 3. Best Practices for Docker Compose
Scenario:
You are tasked with improving the deployment of a multi-container web application (such as a content management system) using Docker Compose. The application consists of several services, including:

A frontend service running Nginx that serves the UI.

A backend service running a Django application.

A database service running MySQL for storing content and user data.

You are required to apply best practices for resource management, scaling, and handling stateful applications like the database service.

Assignment:

Define a Docker Compose setup for the application with proper configurations for all services.

Apply best practices to ensure that the frontend, backend, and database services are properly configured for both development and production environments (e.g., use separate .env files, use non-latest image tags).

Implement a solution to manage persistent storage for the database service to ensure that the data is not lost when the container is restarted or removed.

Limit the resource usage (CPU and memory) of the frontend and backend services to prevent excessive resource consumption.

Demonstrate how to clean up unused volumes and containers after running the application using the docker system prune command.