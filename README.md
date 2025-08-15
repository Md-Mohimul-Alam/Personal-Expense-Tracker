Here's a comprehensive **README** for your full-stack Expense Tracker application, covering both **Frontend** and **Backend**:

---

# Full-Stack Expense Tracker Application

This project is a full-stack application that allows users to manage and track their expenses. It consists of two main parts:

1. **Frontend**: Built with **React**, styled using **TailwindCSS**, and Axios for making HTTP requests.
2. **Backend**: A **REST API** built with **Express**, connected to **MongoDB** for storing and retrieving expense data.

## Table of Contents

* [Frontend](#frontend)
* [Backend](#backend)
* [Setup](#setup)

  * [Frontend Setup](#frontend-setup)
  * [Backend Setup](#backend-setup)
* [API Documentation](#api-documentation)
* [Technologies Used](#technologies-used)

---

## Frontend

The frontend is built with **React** and styled using **TailwindCSS**. It manages the user interface for viewing, adding, editing, and deleting expenses.

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Md-Mohimul-Alam/Personal-Expense-Tracker
   cd frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm start
   ```

   This will run the application on `http://localhost:3000`.

### Project Structure

* `src/`: Contains the main application code.

  * `components/`: Reusable components (e.g., expense table, modal).
  * `services/`: API calls (e.g., fetching, updating, and deleting expenses).
  * `App.js`: The root component for rendering the application.

### Scripts

* **start**: Starts the application in development mode using React's built-in scripts.
* **build**: Builds the app for production.
* **test**: Runs tests with Jest.
* **eject**: Ejects the app from Create React App (advanced usage).

### Dependencies

* `axios`: Used for making HTTP requests to the backend.
* `react-router-dom`: For routing within the app.
* `tailwindcss`: Utility-first CSS framework used for styling.
* `date-fns`: For formatting dates.
* `@testing-library`: Used for testing React components.

---

## Backend

The backend is built using **Node.js**, **Express** for routing, and **MongoDB** for storing expense data. **JWT authentication** and validation are used for user authentication and authorization.

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Md-Mohimul-Alam/Personal-Expense-Tracker
   cd backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file at the root of the backend project and add the following:

   ```env
   PORT=5000
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   ```

4. **Start the development server**:

   ```bash
   npm run dev
   ```

   This will run the backend on `http://localhost:5000`.

### Project Structure

* `app.js`: The entry point for the backend server.
* `models/`: Contains the Mongoose models for the data (e.g., `Expense.js`).
* `routes/`: Contains all the API routes (e.g., `expenseRoutes.js`).
* `controllers/`: Contains the logic for handling API requests.

### Scripts

* **start**: Runs the app in production mode.
* **dev**: Runs the app in development mode using Nodemon for automatic restarts on code changes.

### Dependencies

* `express`: Web framework for handling HTTP requests.
* `mongoose`: MongoDB ORM to interact with the database.
* `jsonwebtoken`: Used for generating and verifying JWT tokens.
* `bcryptjs`: For hashing passwords.
* `cors`: Middleware for enabling cross-origin requests.
* `dotenv`: Loads environment variables from the `.env` file.
* `express-validator`: For validating API request data.

---

## Setup

### Frontend Setup

To set up the frontend, follow these steps:

1. Clone the repository and navigate to the `frontend` directory:

   ```bash
   git clone https://github.com/Md-Mohimul-Alam/Personal-Expense-Tracker
   cd frontend
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Open `http://localhost:3000` in your browser to view the application.

### Backend Setup

To set up the backend, follow these steps:

1. Clone the repository and navigate to the `backend` directory:

   ```bash
   git clone https://github.com/Md-Mohimul-Alam/Personal-Expense-Tracker
   cd backend
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables by creating a `.env` file in the `backend` directory and adding the necessary values (MongoDB URI, JWT secret, etc.).

4. Start the backend server in development mode:

   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:5000`.

---

## API Documentation

The backend provides several RESTful API endpoints for managing expenses. Here are the main ones:

* **POST /api/expenses**: Adds a new expense.
* **GET /api/expenses**: Retrieves all expenses.
* **PUT /api/expenses/\:id**: Updates a specific expense by ID.
* **DELETE /api/expenses/\:id**: Deletes a specific expense by ID.

### Example Request (Adding an Expense)

```bash
POST /api/expenses
{
  "title": "Groceries",
  "amount": 45.99,
  "category": "Food",
  "date": "2023-08-15"
}
```

### Example Response

```json
{
  "success": true,
  "message": "Expense added successfully"
}
```

---

## Technologies Used

* **Frontend**: React, TailwindCSS, Axios
* **Backend**: Node.js, Express, MongoDB, JWT Authentication
* **Dev Tools**: Nodemon (for auto-reloading in development)
