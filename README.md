[notFNB MERN App Video Tutorial](https://www.veed.io/view/9c200a6d-c81e-4372-b67e-9c3a02046d7a?panel=share)

# MERN Banking Application

This is a simple banking application built using the MERN stack (MongoDB, Express, React, Node.js). The application allows users to sign up, log in, and make payments. All routes (except for signup) are protected and require user authentication. The application has multiple user roles (Admin, Employee), with distinct permissions for each.

## Features
- **User Registration**: 
  - Only Admin can register a new user via a secured endpoint (`/register`).
  - User details include name, ID number, account number, email, and password.
  
- **User Login**: 
  - Users can log in using their name, account number, and password. 
  - Admins and employees must log in with the appropriate credentials for role-based access.

- **Role-Based Authentication**: 
  - **Admin**: Can create new users (via `/register`), manage payments, and access the full range of features.
  - **Employee**: Can view and verify payments but cannot create or modify users.
  - All routes are protected based on the user role. Only authenticated users with appropriate roles can access specific resources.
  
- **Payments**: 
  - Authenticated users (Admin and Employee) can make payments with inputs of amount, currency, provider, account number, and code.
  - Employees can view and verify payments via two different endpoints.

- **Logout**: 
  - Users can log out, which clears their authentication token and redirects them to the welcome page.

- **Protected Routes**: 
  - Payments and other routes are protected and can only be accessed by authenticated users.

## Technologies Used
- **Frontend**: React, Axios, CSS
- **Backend**: Node.js, Express.js, JWT (for authentication)
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)

## Getting Started

### Prerequisites
Ensure that you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (either local or Atlas for cloud database)
- [npm](https://www.npmjs.com/get-npm) or [yarn](https://classic.yarnpkg.com/en/docs/install)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/fnbapp.git
   cd fnbapp


2. **Backend Setup:**

   Navigate to the `server` folder and install the dependencies:

   ```bash
   cd server
   npm install
   ```

   Create a `.env` file in the `server` folder and add the following:

   ```env
   PORT=5000
   MONGO_URI=your-mongodb-uri
   JWT_SECRET=your-jwt-secret
   ```

   Start the backend server:

   ```bash
   npm run dev using nodemon
   ```

3. **Frontend Setup:**

   Navigate to the `client` folder and install the dependencies:

   ```bash
   cd frontend-client
   npm install
   ```

   Start the React app:

   ```bash
   npm start
   ```

   The frontend will now be running on [http://localhost:3000](http://localhost:3000).

### Running the Application

- **Backend**: By default, the Express backend will run on [http://localhost:5000](http://localhost:5000).
- **Frontend**: React will run on [http://localhost:3000](http://localhost:3000).

### API Endpoints

| Method | Endpoint           | Description                           |
|--------|--------------------|---------------------------------------|
| POST   | `/register`         | Admin registers a new user            |
| POST   | `/login`            | Log in a user and receive a JWT token |
| POST   | `/logout`           | Log out a user                        |
| GET    | `/payments`         | Get all user payments (protected)     |
| POST   | `/payments`         | Add a new payment (protected)         |

### Available Scripts

In the project directory, you can run:

#### Frontend:
- `npm start`: Runs the app in the development mode.<br>
  Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
- `npm run build`: Builds the app for production to the `build` folder.<br>

#### Backend:
- `npm run server`: Starts the backend with `nodemon` for live reloading.

### Environment Variables

- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for signing JWT tokens.
- `PORT`: Port number on which the backend will run.

### Authentication Flow

- **Sign Up**: Users register by sending their details to the `/register` endpoint (Admin-only access).
- **Login**: Users log in with their credentials (name, account number, and password) to receive a JWT token.
- **Authenticated Requests**: All protected routes require a valid JWT token to be sent in the `Authorization` header.
- **Logout**: Users can log out, which clears the token from `localStorage` and redirects them to the welcome page.

### Role-Based Access Control

- **Admin**:
  - Can create new users (via `/register`).
  - Can manage payments and access all resources.
  
- **Employee**:
  - Can view and verify payments via two specific endpoints but cannot create or modify users.
  
### Folder Structure

```bash
mern-banking-app/
 ├── client/              # Frontend React code
 │   ├── src/
 │   ├── public/
 │   └── package.json
 ├── server/              # Backend Express.js code
 │   ├── models/          # Mongoose models
 │   ├── routes/          # API routes
 │   ├── controllers/     # Route logic
 │   ├── middleware/      # Authentication middleware (JWT)
 │   └── package.json
 ├── README.md            # Project documentation
 └── .gitignore           # Git ignore file
```

### Security Considerations

- **JWT Storage**: Tokens are stored in `localStorage`. This is fine for simple applications, but in a production environment, consider using `httpOnly` cookies for added security.
- **HTTPS**: Ensure your application is served over HTTPS in production to secure all communication between the client and server.

### Testing with Newman

- Integrated **Newman testing** for the following endpoints:
  - Login
  - Add Payment
  - Register User (Admin-only)

- These tests can be run using the `npm run test-api` command. The test scripts will validate the correct functionality of these endpoints.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

