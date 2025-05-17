# CS Tech Project

##  Developer

Vinayak Kumar Singh
+91 9630576848
vinayaksingh.internship@gmail.com

## Description

This project is a web application designed for managing sales leads, agents, and distributing lists of potential customers to agents. It includes features for user authentication (login/registration), agent management, list uploading and distribution, and a dashboard to view relevant information.

## Features

*   User Authentication (Register, Login, Logout)
*   Agent Management (Add, View, Edit, Delete agents)
*   List Management (Upload CSV/XLSX files, Distribute lists to agents, View distributed lists)
*   Dashboard to provide an overview
*   Dark/Light mode theme toggle

## Technologies Used

**Frontend:**

*   React
*   TypeScript
*   Vite (for development server and bundling)
*   Tailwind CSS (for styling)
*   Shadcn/ui (React components)
*   Axios (for API requests)
*   React Router DOM (for navigation)

**Backend:**

*   Node.js
*   Express (web application framework)
*   Mongoose (MongoDB object modeling)
*   MongoDB (database)
*   bcryptjs (for password hashing)
*   jsonwebtoken (for JWT authentication)
*   express-async-handler
*   multer (for file uploads)
*   csv-parser (for CSV processing)
*   xlsx (for Excel file processing)

## Setup and Installation

**Prerequisites:**

*   Node.js and npm (or yarn/pnpm) installed
*   MongoDB installed and running

**Steps:**

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd "CS Tech"
    ```

2.  **Install server dependencies:**

    ```bash
    cd server
    npm install
    ```

3.  **Install client dependencies:**

    ```bash
    cd ../client
    npm install
    ```

4.  **Configure Environment Variables:**

    Create a `.env` file in the `server` directory. Add the following variables:

    ```env
    PORT=5000
    MONGO_URI=<Your_MongoDB_Connection_String>
    JWT_SECRET=<A_Secret_String_For_JWT>
    NODE_ENV=development
    ```

    *Replace `<Your_MongoDB_Connection_String>` with your actual MongoDB connection string.* Ensure your MongoDB server is running and accessible.

## Running the Application

1.  **Start the backend server:**

    Open your terminal, navigate to the `server` directory, and run:

    ```bash
    npm run dev
    ```

    Alternatively, you can run:

    ```bash
    node index.js
    ```

    The server should start on the port specified in your `.env` file (defaulting to 5000).

2.  **Start the frontend client:**

    Open a **new** terminal window, navigate to the `client` directory, and run:

    ```bash
    npm run dev
    ```

    The client development server should start (usually on port 5173). The application will automatically open in your browser.

## Project Structure

```
CS Tech/
├── client/              # Frontend application
│   ├── public/
│   │   ├── assets/
│   │   │   ├── components/    # Reusable React components
│   │   │   ├── lib/           # Utility functions, theme provider, etc.
│   │   │   ├── pages/         # Page components (Login, Register, Dashboard, Agents, Lists)
│   │   │   ├── App.tsx        # Main App component
│   │   │   ├── main.tsx       # Entry point (with ThemeProvider and Axios interceptor)
│   │   │   └── index.css      # Global styles
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── postcss.config.cjs
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   └── server/              # Backend application
│       ├── config/          # Database connection setup
│       ├── controllers/     # Request handlers
│       ├── middleware/      # Express middleware (auth, error handling, upload)
│       ├── models/          # Mongoose models
│       ├── routes/          # API routes
│       ├── utils/           # Utility functions
│       ├── .env             # Environment variables (create this file)
│       ├── index.js         # Server entry point
│       ├── package.json
│       └── server.js        # (Potentially, depending on setup - check index.js)
```

## API Endpoints (Key Examples)

*   `POST /api/auth/register` - Register a new user
*   `POST /api/auth/login` - Login a user
*   `GET /api/agents` - Get all agents (Protected)
*   `POST /api/agents` - Create a new agent (Protected)
*   `POST /api/lists/upload` - Upload and distribute a list (Protected)
*   `GET /api/lists/distributed` - Get distributed lists (Protected)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

