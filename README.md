# Laundry Booking Backend

This is the backend for the Laundry Booking App. Built with Node.js, Express, MongoDB, and JWT.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with:
   ```env
   MONGODB_URI=mongodb+srv://pratikkanojiya:Ph9819740701@cluster0.fveoutd.mongodb.net/laundrydb?retryWrites=true&w=majority
   JWT_SECRET=supersecretjwtkey
   ```
3. Start the server:
   ```bash
   npm start
   ```

## Endpoints

- `POST   /api/auth/register`      Register user
- `POST   /api/auth/login`         User login
- `POST   /api/auth/admin-login`   Admin login
- `POST   /api/bookings`           Create booking (user)
- `GET    /api/bookings/my`        Get my bookings (user)
- `PUT    /api/bookings/:id`       Update my booking (user)
- `DELETE /api/bookings/:id`       Delete my booking (user)
- `GET    /api/bookings`           Get all bookings (admin)
- `PATCH  /api/bookings/status/:id` Update booking status (admin)

## Notes
- CORS is enabled for https://online-laundry-service.vercel.app
- Make sure to create an admin user in MongoDB for admin login. 