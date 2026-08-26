# EventHub — Full-Stack Event Management Application

A full-stack event management platform with secure authentication, event
creation & registration, QR-code ticket generation, and attendance tracking.

**Stack:** Node.js, Express.js, MongoDB (Mongoose) · React.js, Tailwind CSS · JWT Auth · Multer · Nodemailer · `qrcode`

## Features

- 🔐 Secure authentication (JWT, bcrypt-hashed passwords, role-based access: attendee / organizer / admin)
- 🗓️ Event management — create, edit, delete, search/filter events, upload event poster images
- 🎟️ Event registration with auto-generated **QR-code tickets**
- 📧 Email notifications on successful registration (Nodemailer)
- ✅ Attendance tracking — organizers scan/enter a ticket ID to check attendees in, with live attendance stats
- 📱 Fully responsive UI (React + Tailwind CSS) across desktop and mobile
- 🌐 20+ REST API endpoints across auth, events, registrations, and attendance

## Project Structure

```
eventhub/
├── backend/
│   ├── config/db.js
│   ├── controllers/        # authController, eventController, registrationController, attendanceController
│   ├── middleware/         # auth (JWT), upload (multer), errorHandler
│   ├── models/             # User, Event, Registration
│   ├── routes/             # authRoutes, eventRoutes, registrationRoutes, attendanceRoutes
│   ├── utils/               # generateToken, generateQR, sendEmail
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── context/AuthContext.jsx
    │   ├── components/     # Navbar, EventCard, PrivateRoute
    │   ├── pages/           # Events, EventDetail, Login, Register, CreateEvent, MyTickets, Dashboard, Attendance
    │   └── App.jsx
    └── vite.config.js
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env with your MongoDB URI, JWT secret, and (optionally) email credentials
npm run dev
```

The API runs on `http://localhost:5000`.

### 2. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173` and proxies `/api` and `/uploads` requests to the backend.

### 3. Try it out

1. Register an account as an **Organizer**.
2. Create an event (with a poster image).
3. Register a second account as an **Attendee**, browse events, and register for one — a QR-code ticket is generated and (if email is configured) emailed to you.
4. Log back in as the organizer and go to **Check-In** to mark attendees present by entering/scanning their ticket ID.

## API Overview

| Area | Endpoints |
|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `PUT /api/auth/me` |
| Events | `GET /api/events`, `GET /api/events/:id`, `GET /api/events/mine/list`, `POST /api/events`, `PUT /api/events/:id`, `DELETE /api/events/:id` |
| Registrations | `POST /api/registrations/:eventId`, `GET /api/registrations/mine`, `GET /api/registrations/:id`, `GET /api/registrations/event/:eventId`, `DELETE /api/registrations/:id`, `POST /api/registrations/:id/resend` |
| Attendance | `POST /api/attendance/check-in`, `GET /api/attendance/verify/:ticketId`, `GET /api/attendance/event/:eventId` |

## Environment Variables (backend/.env)

See `backend/.env.example` for all variables (Mongo URI, JWT secret, SMTP credentials for email notifications).

## License

MIT
