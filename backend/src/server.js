import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import roomsRoutes from './routes/rooms.routes.js';
import bookingsRoutes from './routes/bookings.routes.js';
import customersRoutes from './routes/customers.routes.js';
import adminRoutes from './routes/admin.routes.js'; 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//routes
app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
})

app.use('/api/rooms', roomsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});