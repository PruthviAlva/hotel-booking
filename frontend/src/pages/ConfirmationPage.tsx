import { useParams, useLocation, useNavigate } from "react-router-dom";

function ConfirmationPage() {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { transactionId } = location.state || {};

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "500px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <h2>✅ Booking Confirmed!</h2>
      <p>Booking ID: {bookingId}</p>
      {transactionId && <p>Transaction ID: {transactionId}</p>}
      <p>Payment status: Paid</p>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          marginTop: "1.5rem",
        }}
      >
        <button onClick={() => navigate("/my-bookings")}>
          View My Bookings
        </button>
        <button onClick={() => navigate("/")}>Book Another Room</button>
      </div>
    </div>
  );
}

export default ConfirmationPage;
