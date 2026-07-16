import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";

interface Room {
  id: number;
  hotel_id: number;
  room_number: string;
  room_type: string;
  price: string;
  capacity: number;
  description: string;
  images: string[];
  status: string;
}

function RoomsList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const navigate = useNavigate();

  const fetchRooms = async (params?: {
    checkIn: string;
    checkOut: string;
    guests: number;
  }) => {
    setLoading(true);
    try {
      const res = await client.get("/rooms", { params });
      setRooms(res.data);
    } catch (err) {
      console.error("Failed to fetch rooms", err);
      setRooms([]); // ensure rooms stays a valid array even on failure
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms(); // load all rooms on first visit, no filters
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRooms({ checkIn, checkOut, guests });
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Trinity Suites</h1>

      <form
        onSubmit={handleSearch}
        style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}
      >
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          required
        />
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          required
        />
        <input
          type="number"
          min={1}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          required
        />
        <button type="submit">Search Rooms</button>
      </form>

      {loading ? (
        <p>Loading rooms...</p>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {rooms.map((room) => (
            <div
              key={room.id}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                borderRadius: "8px",
              }}
            >
              <h3>
                {room.room_type} — Room {room.room_number}
              </h3>
              <p>{room.description}</p>
              <p>Capacity: {room.capacity} guests</p>
              <p>₹{room.price} / night</p>
              <button
                onClick={() =>
                  navigate(`/booking/${room.id}`, {
                    state: { checkIn, checkOut, guests, room },
                  })
                }
              >
                Book Now
              </button>
            </div>
          ))}
          {rooms.length === 0 && <p>No rooms found for these dates.</p>}
        </div>
      )}
    </div>
  );
}

export default RoomsList;
