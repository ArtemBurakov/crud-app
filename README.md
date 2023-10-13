# Nest.js CRUD App for Users and Posts

This is a Nest.js application that provides CRUD (Create, Read, Update, Delete) functionality for users and their posts. The app includes role-based guards, JWT (JSON Web Token) authentication, and token refresh functionality.

## Prerequisites

Before getting started, ensure you have the following prerequisites installed on your local machine:

### Node.js

You can download and install Node.js from the official website: [Node.js](https://nodejs.org/)

### Docker and Docker Compose

- Docker: [Install Docker](https://docs.docker.com/get-docker/)
- Docker Compose: [Install Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

Follow these steps to set up and run the Nest.js CRUD app on your local machine.

### Clone the Repository

```bash
git clone https://github.com/ArtemBurakov/crud-app.git
cd crud-app
```

## Install Dependencies

In the project directory, run the following command to install the required Node.js packages:

```bash
npm install
```

## Configure .env file

Ensure you have a .env file in the root folder with the following environment variables:

```bash
DB_TYPE=postgres
DB_HOST=postgres-db
DB_PORT=5432
DB_USER=userName
DB_PASSWORD=12345
DB_NAME=nest-app
DB_SYNCHRONIZE=true
DB_LOGGING=true
JWT_ACCESS_SECRET=my_secret
JWT_ACCESS_EXPIRATION=15min
JWT_REFRESH_SECRET=my_secret
JWT_REFRESH_EXPIRATION=7d
```

## Run App

### Start the app in development mode:

```bash
npm run start:dev
```

### To run the app in production mode:

```bash
npm run start:prod
```

### Using Docker Compose

You can also run the app using Docker Compose. 

```Bash
docker compose up -d
```

## Deploying on AWS EC2

To deploy the app on an AWS EC2 instance, follow these general steps:
- Launch an AWS EC2 instance using your AWS account.
- Use SSH to connect to your EC2 instance.
- Install Docker and Docker Compose on the EC2 instance.
- Clone your project repository and run `npm install` on the EC2 instance.
- Create the .env file on the EC2 instance with your environment variables.
- Run `docker-compose up -d` to start the app on the EC2 instance.

For more detailed instructions on deploying a Node.js app on AWS EC2, refer to the AWS documentation or relevant [tutorials](https://everythingdevops.dev/how-to-deploy-a-multi-container-docker-compose-application-on-amazon-ec2/).

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.