## 1. Create a Multistage Dockerfile for a React Application
Develop a Dockerfile that uses multistage builds to:

Build the React app in a node environment.

Serve the built application using a lightweight server like nginx.

Ensure the final image is optimized and does not include any unnecessary dependencies.

Test the container by running it locally and accessing the app in a browser.

## 2. Optimize a Node.js Application Docker Image
Given the following requirements, write a multistage Dockerfile for a Node.js application:

Use a node image to install dependencies and build the application.

Use a lightweight base image (node:alpine) to run the application in the final stage.

Include optimizations for:

Caching dependencies.

Minimizing image size.

Excluding unnecessary files using .dockerignore.

Test the Docker image locally.

## 3. Analyze and Reduce the Size of a Docker Image
Given a Dockerfile for a Vue.js application, analyze the size of the generated image using tools like dive or docker image inspect.

Identify unnecessary layers or files that can be optimized.

Refactor the Dockerfile to:

Use multistage builds.

Reduce the image size while maintaining functionality.

Submit a report detailing your changes and the impact on image size.

## 4. Deploy a Full-Stack JavaScript Application Using Multistage Builds
Develop and dockerize a full-stack JavaScript application (e.g., React frontend with an Express backend):

Use a multistage build for the frontend to build and serve the app.

Use a separate multistage build for the backend to optimize runtime.

Combine both frontend and backend into a single docker-compose.yml file.

Ensure both services communicate correctly and can be accessed locally.

Submit your Dockerfiles and docker-compose.yml with a brief explanation of your setup.