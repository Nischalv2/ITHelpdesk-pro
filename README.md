# ITHelpdesk-pro 🚀

A full-stack IT Helpdesk Management System built to manage support tickets, track issues, and demonstrate modern web application development.

## Features

- Create IT support tickets
- View all tickets
- Store ticket data in MongoDB
- REST API backend
- React frontend interface
- Ticket categories and priorities
- Real-time ticket display after creation

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Installation

### Clone repository

```bash
git clone https://github.com/Nischalv2/ITHelpdesk-pro.git
Backend Setup

Go to backend folder:

cd backend

Install dependencies:

npm install

Create a .env file inside the backend folder:

PORT=5001
MONGODB_URI=your_mongodb_connection_string

Start backend server:

npm run dev

Backend runs on:

http://localhost:5001
Frontend Setup

Open another terminal:

cd frontend

Install dependencies:

npm install

Start frontend:

npm run dev

Frontend runs on:

http://localhost:5173
API Endpoints
Get all tickets
GET /api/tickets
Create ticket
POST /api/tickets

Example:

{
  "title": "Laptop issue",
  "description": "Laptop cannot connect to WiFi",
  "category": "Network",
  "priority": "High"
}
Future Improvements
User authentication
Admin dashboard
Ticket assignment
Status workflow
Email notifications
Cloud deployment
Author

Nischal Bhandari

GitHub:
https://github.com/Nischalv2