# Eventhub - A Event Management System 🗓️

This repository is a full-stack **Event Management System** designed to enable users to create, manage, and join events. The system is built with **Node.js**, **Express**, **MongoDB**, **React**, and **Socket.IO** for real-time updates. It also integrates with **Cloudinary** for image uploads and **JWT** for secure authentication.

---

## Features

- **User Authentication:** Register, login, logout, and check authentication status.
- **Event Management:** Create, edit, delete, and view events with image support.
- **Real-time Updates:** Dynamic updates when users join or leave events using Socket.IO.
- **Role-based Access:** Event creators can update or delete events.
- **Mobile-Responsive Frontend:** Built with React to ensure a seamless user experience across devices.

---

## Table of Contents

1. [Installation](#installation)
2. [Controllers](#controllers)
3. [Models](#models)
4. [Routes](#routes)
5. [Middleware](#middleware)
6. [Utilities](#utilities)
7. [Frontend Components](#frontend-components)
8. [Project Structure](#project-structure)
9. [Contributing](#contributing)
10. [License](#license)

---

## Installation

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/your-username/event-management-system.git
   cd event-management-system
   ```

2. **Backend Setup**
   - Navigate to the `backend` directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file and configure the following variables:
     ```
     MONGO_URI=your_mongodb_connection_string
     CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
     CLOUDINARY_API_KEY=your_cloudinary_api_key
     CLOUDINARY_API_SECRET=your_cloudinary_api_secret
     JWT_SECRET=your_jwt_secret
     ```
   - Start the backend server:
     ```bash
     npm start
     ```

3. **Frontend Setup**
   - Navigate to the `frontend` directory:
     ```bash
     cd ../frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the React development server:
     ```bash
     npm start
     ```

4. **Access the Application**
   - Open your browser and visit: `http://localhost:3000`

---

## Controllers

### **Event Controller**

- **CreateEvent**
  - Validates required fields: `name`, `description`, `date`, `location`, `capacity`, `category`, `imageUrl`.
  - Uploads event images to Cloudinary.
  - Creates a new event in the database.
  - Returns the created event or an error message.

- **getAllEvents**
  - Fetches all events from the database.
  - Populates the creator's name and sorts events by date.

- **getEventById**
  - Retrieves a specific event by ID.
  - Populates the creator's and attendees' names.
  - Returns the event or an error if not found.

- **deleteEvent**
  - Deletes an event by ID.
  - Returns a success message or an error if the event is not found.

- **updateEvent**
  - Validates the event's existence and the user's authorization.
  - Updates event details and image (if provided).
  - Returns the updated event or an error.

- **joinEvent**
  - Validates event existence and capacity.
  - Adds the user to the event's attendees.
  - Emits a socket event to notify other users of member updates.

- **leaveEvent**
  - Removes the user from the event's attendees.
  - Emits a socket event for member updates.

### **User Controller**

- **Register**
  - Validates if the user already exists.
  - Hashes the password and creates a new user.
  - Generates a token and returns user details.

- **Login**
  - Validates user credentials.
  - Generates a token and returns user details.

- **Logout**
  - Clears the JWT cookie.

- **checkAuth**
  - Confirms the user's authentication status.

---

## Models

### **Event Model**

- Fields:
  - `name`, `description`, `date`, `location`, `category`, `imageUrl`, `creator`, `attendees`, `capacity`.
- Relationships:
  - References the **User Model** for the creator and attendees.

### **User Model**

- Fields:
  - `email`, `password`, `name`, `isGuest`, `eventsCreated`, `eventsAttending`.
- Relationships:
  - References the **Event Model** for `eventsCreated` and `eventsAttending`.

---

## Routes

### **Event Routes**
- **POST** `/createevent`: Create a new event.
- **GET** `/getevents`: Retrieve all events.
- **GET** `/:id`: Retrieve a specific event by ID.
- **PUT** `/:id/update`: Update an event.
- **DELETE** `/:id/delete`: Delete an event.
- **POST** `/:id/join`: Join an event.
- **POST** `/:id/leave`: Leave an event.

### **User Routes**
- **POST** `/register`: Register a new user.
- **POST** `/login`: Login a user.
- **GET** `/checkauth`: Check user authentication.
- **GET** `/logout`: Logout a user.

---

## Middleware

### **Auth Middleware**
- **protectRoute**:
  - Checks for a JWT in cookies.
  - Verifies the token and retrieves the user.
  - Proceeds if authenticated, otherwise returns an error.

---

## Utilities

### **Cloudinary**
- Configures Cloudinary with environment variables for secure image uploads.

### **MongoDB**
- Establishes a connection to MongoDB using environment variables.

### **Socket.IO**
- Configures a Socket.IO server with CORS settings.
- Handles user connection and disconnection events.

### **JWT Utility**
- **generateToken**:
  - Signs a JWT with the user ID.
  - Sets a secure cookie containing the token.

---

## Frontend Components

### **Navbar**
- Displays navigation links based on the user's authentication status.
- Includes functionality for mobile menu toggle and logout.

### **Notifications**
- Uses `react-toastify` for real-time notifications.

### **CreateEvent Component**
- A form for creating events.
- Validates input fields and uploads images.
- Sends event data to the server.

### **EditEvent Component**
- A form for editing existing events.
- Fetches event details by ID and populates the form.
- Validates input fields and updates the event.

### **EventDashboard Component**
- Displays events the user is hosting or attending.
- Filters and shows relevant events.

### **EventDetails Component**
- Displays detailed information about an event.
- Allows users to join, leave, update, or delete events.

### **Home Component**
- Displays all available events and links to event details.

### **Login Component**
- Provides a form for user login with input validation.

### **Register Component**
- Provides a form for user registration with input validation.

---

## Project Structure

```plaintext
backend/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
frontend/
├── components/
├── pages/
├── store/
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Submit a pull request.

---