import { useState } from "react";
import client from "../api/client";

interface Booking {
  id: number;
  hotel_name: string;
  room_number: string;
  room_type: string;
  check_in: string;
  check_out: string;
  booking_status: string;
  payment_status: string;
  total_amount: string;
}

function MyBookings() {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const customerRes = await client.get(`/customers/email/${email}`);
      const bookingsRes = await client.get(
        `/bookings/customer/${customerRes.data.id}`,
      );
      setBookings(bookingsRes.data);
      if (bookingsRes.data.length === 0)
        setError("No bookings found for this email.");
    } catch (err: any) {
      setError("No bookings found for this email.");
      setBookings([]);
      console.error(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
      <h2>My Bookings</h2>
      <form
        onSubmit={handleLookup}
        style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}
      >
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Find Bookings"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {bookings.map((b) => (
        <div
          key={b.id}
          style={{
            border: "1px solid #ccc",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        >
          <p>
            {b.hotel_name} — {b.room_type} (Room {b.room_number})
          </p>
          <p>
            {b.check_in} → {b.check_out}
          </p>
          <p>
            Status: {b.booking_status} | Payment: {b.payment_status}
          </p>
          <p>Total: ₹{b.total_amount}</p>
        </div>
      ))}
    </div>
  );
}

export default MyBookings;
