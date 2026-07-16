import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import client from "../api/client";

function BookingPage() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { checkIn, checkOut, guests, room } = location.state || {};

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const nights =
    checkIn && checkOut
      ? Math.ceil(
          (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 0;
  const totalAmount = room ? Number(room.price) * nights : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // 1. create/upsert customer
      const customerRes = await client.post("/customers", {
        name,
        email,
        phone,
        location: "",
      });
      const customerId = customerRes.data.id;

      // 2. create booking
      const bookingRes = await client.post("/bookings", {
        customerId,
        roomId: Number(roomId),
        checkIn,
        checkOut,
        guests,
        totalAmount,
      });

      // 3. go to payment page with the new bookingId
      navigate(`/payment/${bookingRes.data.id}`, {
        state: { totalAmount, customerId },
      });
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError(
          "Sorry, this room was just booked by someone else. Please choose another.",
        );
      } else {
        console.error(err.response?.data || err);
        setError(
          err.response?.data?.error ||
            "Something went wrong. Please try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!room || !checkIn || !checkOut) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>
          Missing booking details. Please search for rooms and select dates
          first.
        </p>
        <button onClick={() => navigate("/")}>Back to Search</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Booking Summary</h2>
      <p>
        {room.room_type} — Room {room.room_number}
      </p>
      <p>
        Check-in: {checkIn} | Check-out: {checkOut} | Guests: {guests}
      </p>
      <p>
        {nights} night(s) × ₹{room.price} = ₹{totalAmount}
      </p>

      <h3>Guest Details</h3>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
      >
        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Processing..." : "Proceed to Payment"}
        </button>
      </form>
    </div>
  );
}

export default BookingPage;
