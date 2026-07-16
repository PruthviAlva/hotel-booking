import { useEffect, useState } from "react";
import client from "../api/client";

interface Stats {
  total_rooms: string;
  available_rooms: string;
  total_bookings: string;
  total_customers: string;
  revenue: string;
}

interface Room {
  id: number;
  hotel_id: number;
  room_number: string;
  room_type: string;
  price: string;
  capacity: number;
  status: string;
}

interface AdminBooking {
  id: number;
  customer_name: string;
  customer_email: string;
  hotel_name: string;
  room_number: string;
  check_in: string;
  check_out: string;
  booking_status: string;
  payment_status: string;
  total_amount: string;
}

function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [newRoom, setNewRoom] = useState({
    hotel_id: 1,
    room_number: "",
    room_type: "Standard",
    price: "",
    capacity: 1,
    description: "",
    images: [""],
    status: "Available",
  });

  const loadAll = async () => {
    const [statsRes, roomsRes, bookingsRes] = await Promise.all([
      client.get("/dashboard"),
      client.get("/rooms"),
      client.get("/admin/bookings"),
    ]);
    setStats(statsRes.data);
    setRooms(roomsRes.data);
    setBookings(bookingsRes.data);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await client.post("/admin", newRoom);
      setNewRoom({ ...newRoom, room_number: "", price: "", description: "" });
      loadAll();
    } catch (err) {
      console.error(err);
      alert("Failed to add room");
    }
  };

  const handleDeleteRoom = async (id: number) => {
    if (!confirm("Delete this room?")) return;
    try {
      await client.delete(`/admin/${id}`);
      loadAll();
    } catch (err) {
      console.error(err);
      alert("Failed to delete room");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
      <h1>Admin Dashboard</h1>

      {stats && (
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
          }}
        >
          <StatCard label="Total Rooms" value={stats.total_rooms} />
          <StatCard label="Available Rooms" value={stats.available_rooms} />
          <StatCard label="Total Bookings" value={stats.total_bookings} />
          <StatCard label="Total Customers" value={stats.total_customers} />
          <StatCard label="Revenue" value={`₹${stats.revenue}`} />
        </div>
      )}

      <h2>Rooms</h2>
      <form
        onSubmit={handleAddRoom}
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <input
          placeholder="Room Number"
          value={newRoom.room_number}
          onChange={(e) =>
            setNewRoom({ ...newRoom, room_number: e.target.value })
          }
          required
        />
        <select
          value={newRoom.room_type}
          onChange={(e) =>
            setNewRoom({ ...newRoom, room_type: e.target.value })
          }
        >
          <option>Standard</option>
          <option>Deluxe</option>
          <option>Suite</option>
        </select>
        <input
          placeholder="Price"
          type="number"
          value={newRoom.price}
          onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
          required
        />
        <input
          placeholder="Capacity"
          type="number"
          value={newRoom.capacity}
          onChange={(e) =>
            setNewRoom({ ...newRoom, capacity: Number(e.target.value) })
          }
          required
        />
        <input
          placeholder="Description"
          value={newRoom.description}
          onChange={(e) =>
            setNewRoom({ ...newRoom, description: e.target.value })
          }
        />
        <button type="submit">Add Room</button>
      </form>

      <table
        border={1}
        cellPadding={8}
        style={{
          width: "100%",
          marginBottom: "2rem",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>Room</th>
            <th>Type</th>
            <th>Price</th>
            <th>Capacity</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((r) => (
            <tr key={r.id}>
              <td>{r.room_number}</td>
              <td>{r.room_type}</td>
              <td>₹{r.price}</td>
              <td>{r.capacity}</td>
              <td>{r.status}</td>
              <td>
                <button onClick={() => handleDeleteRoom(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Bookings</h2>
      <table
        border={1}
        cellPadding={8}
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Customer</th>
            <th>Hotel</th>
            <th>Room</th>
            <th>Dates</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.customer_name}</td>
              <td>{b.hotel_name}</td>
              <td>{b.room_number}</td>
              <td>
                {b.check_in} → {b.check_out}
              </td>
              <td>{b.booking_status}</td>
              <td>{b.payment_status}</td>
              <td>₹{b.total_amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "1rem",
        borderRadius: "8px",
        minWidth: "140px",
      }}
    >
      <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.7 }}>{label}</p>
      <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>
        {value}
      </p>
    </div>
  );
}

export default AdminDashboard;
