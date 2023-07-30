## Note Taking Application - Setup and Testing Guide

This guide will walk you through the steps to set up and test the Note Taking application, which uses 
- Express
- MySQL
- Sequelize
- Docker Compose
- Redis
  

The application implements the following API routes for authentication and note actions.
### Prerequisites:

Before you proceed, ensure you have the following installed on your system:

```bash 
- Node.js and npm (Node Package Manager)
- Docker
```
#### 1. Clone the Repository:
```bash
$ git clone <repository_url>
$ cd note-taking-app
```

#### 2. Install Dependencies:

```bash
$ npm install
```

#### 3. Configuration:

By default, it already has .env file that can be use for testing purpose. But you can also create a new .env file in the root directory and provide the necessary configuration
` .env`
```bash
PORT=3000
JWT_SECRET=secret
JWT_EXPIRES_IN=1d
# MySQL Database Configuration
MYSQL_HOST=mysql
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=note_taking
MYSQL_PORT=3306

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
```
Replace your_mysql_password with the actual password for your MySQL database.

#### 4. MySQL Database Migration:
Create `note_taking` app DB in your MySQL, and run the migration script on your MySQL. The migration
Script can be found in the root directory of the application under the `migration` folder.
*Note:*If you use `docker compose up` the migration will be done automatically.

#### 5. Start the Application:
You can run the application locally using Node.js or using Docker Compose. Choose one of the following options:

##### Option 1: Run with Docker Compose
```bash
docker-compose up
```
##### Option 2: Run Locally with Node.js

Start the application using npm:

```bash
$ npm start
```

### 6. API Endpoints:

Once the application is running, you can test the API endpoints using tools like curl, `Postman`, or any other API testing client.

**Authentication APIs:**

1. Register User
  - Method: POST
  - Endpoint: http://localhost:3000/api/v1/auth/register
  - Payload:
```bash 
{
  "name": "your_username",
  "email": "your_email"
  "password": "your_password"
} 
```  


1. Login User
  - Method: POST
  - Endpoint: http://localhost:3000/api/v1/auth/login
  - Payload:

```bash
{
  "email": "your_username",
  "password": "your_password"
}
```

**Notes APIs:**
1. Create Note (Requires Authentication)
  - Method: POST
  - Endpoint: http://localhost:3000/api/v1/user/notes
  - Payload:
  
  ```bash
  {
    "title": "Note Title",
    "content": "Note Content",
    "type": "Note type, personal or work"
  }
  ```

2. Get All Notes (Requires Authentication)
  - Method: GET
  - Endpoint: http://localhost:3000/api/v1/user/notes


3. Get Note by ID (Requires Authentication)
  - Method: GET
  - Endpoint: http://localhost:3000/api/v1/user/notes/:id
  
   
4. Update Note by ID (Requires Authentication)
  - Method: PUT
  - Endpoint: http://localhost:3000/api/v1/user/notes/:id
  - Payload:

```bash
{
  "title": "Updated Note Title",
  "content": "Updated Note Content"
}
```

5. Delete Note by ID (Requires Authentication)
  - Method: DELETE
  - Endpoint: http://localhost:3000/api/v1/user/notes/:id

**System Logs:**

The application utilizes the Singleton Design Pattern for storing system logs. The logs are automatically generated and managed by the system. 
The logs are stored in the application root directory under `logs` folder.

**Note Types:**

The application uses the Factory Design Pattern to create different types of notes, such as personal and work notes. The note types are created and handled dynamically based on the provided parameters.

#### 7. Testing Redis Caching:

The application uses Redis for caching notes. To test the caching functionality, follow these steps:
1. Create a new note using the "Create Note" API endpoint.
2. Retrieve the note using the `Get All Notes` API endpoint. Take note of the response time.
3. Retrieve the same note again using the `Get All Notes` API endpoint. Observe that the response time is significantly faster due to caching.

In addition, you can also see from logs, if get all notes request is served from Redis cache or MySQL database.
