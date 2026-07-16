# Hotel Booking System

A full-stack hotel booking application where guests can search available rooms, book a room, complete a simulated payment, and view booking confirmations and history. Admins can manage rooms and bookings through a dashboard.

## Live Demo

- **Frontend**: https://hotel-booking-inky-seven.vercel.app/
- **Backend API**: https://hotel-booking-rele.onrender.com/api
- **Admin Dashboard**: https://hotel-booking-inky-seven.vercel.app/admin

> Note: the backend is hosted on Render's free tier, which spins down after inactivity. The first request after idle time may take 30-60 seconds to respond.

## Features

**Guest**
- Search rooms by check-in date, check-out date, and guest count
- View room details (price, capacity, description, images)
- Book a room with guest details and a booking summary
- Simulated payment flow (success/failure)
- Booking confirmation with transaction reference
- Look up booking history by email

**Admin**
- Dashboard with live stats: total rooms, available rooms, total bookings, total customers, revenue
- Room management: create, update, delete
- View all bookings with customer, room, and hotel details

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TypeScript, React Router, Axios |
| Backend | Node.js, Express (ES Modules) |
| Database | PostgreSQL (hosted on Neon) |
| Deployment | Vercel (frontend), Render (backend), Neon (database) |

**Why PostgreSQL instead of the suggested MongoDB?**
The core technical challenge in this project is preventing double-booking under concurrent requests. PostgreSQL provides native ACID transactions and constraint enforcement — specifically, an `EXCLUDE` constraint on the `bookings` table guarantees at the database level that two non-cancelled bookings for the same room can never have overlapping date ranges. This closes the race-condition window more directly than an application-level status check would.

## Project Structure

```
hotel-booking/
  backend/
    src/
      db/           # connection pool, seed script
      controllers/  # route handlers
      routes/       # Express routers
      server.js
  frontend/
    src/
      api/          # axios client
      pages/        # RoomsList, BookingPage, PaymentPage, ConfirmationPage, MyBookings, AdminDashboard
      App.tsx
  docs/
    requirement-analysis.md
```

## Setup Instructions (Local Development)

### Backend
```bash
cd backend
npm install
# create a .env file (see Environment Variables below)
npm run seed   # populates sample hotels and rooms
npm run dev    # starts on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
# create a .env file (see Environment Variables below)
npm run dev    # starts on http://localhost:5173
```

## Environment Variables

**backend/.env**
```
DATABASE_URL=your_postgres_connection_string
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api
```

Neither `.env` file is committed to this repository.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/health | Health check |
| GET | /api/rooms | List rooms (optionally filtered by checkIn, checkOut, guests) |
| GET | /api/rooms/:id | Get a single room |
| POST | /api/customers | Create/upsert a customer |
| GET | /api/customers/email/:email | Look up a customer by email |
| POST | /api/bookings | Create a booking (returns 409 if room unavailable) |
| POST | /api/bookings/payment | Process a mock payment for a booking |
| GET | /api/bookings/customer/:customerId | Get bookings for a customer |
| PATCH | /api/bookings/:id/cancel | Cancel a booking |
| GET | /api/admin/bookings | Get all bookings (admin view, joined with customer/room/hotel) |
| POST | /api/admin | Create a room |
| PUT | /api/admin/:id | Update a room |
| DELETE | /api/admin/:id | Delete a room |
| GET | /api/dashboard | Get admin dashboard statistics |

## AI Tools Used

Claude (Anthropic) was used as a learning and reference aid — to explain database concurrency concepts (e.g., PostgreSQL `EXCLUDE` constraints, locking strategies) before implementation, to review self-written code for bugs, and to help troubleshoot a few environment and deployment issues (e.g. SPA routing on Vercel). All application code, schema design, and features were written, tested, and debugged independently.

## Future Improvements

- JWT-based authentication for the admin dashboard
- UI styling pass (current interface is functional but minimally styled)
- Automated test suite for booking concurrency and API endpoints
- Pagination and richer filtering on admin tables