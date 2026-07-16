import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import client from "../api/client";

function PaymentPage() {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { totalAmount } = location.state || {};

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    setProcessing(true);
    setError("");

    try {
      const res = await client.post("/bookings/payment", {
        bookingId: Number(bookingId),
        paymentMethod: "Card",
      });

      // success → go to confirmation
      navigate(`/confirmation/${bookingId}`, {
        state: { transactionId: res.data.transactionId },
      });
    } catch (err: any) {
      // our backend sends 402 on simulated payment failure
      if (err.response?.status === 402) {
        setError(
          "Payment failed. Your booking has been cancelled. Please try booking again.",
        );
      } else {
        setError("Something went wrong processing payment.");
      }
      console.error(err.response?.data || err);
    } finally {
      setProcessing(false);
    }
  };

  if (!bookingId) {
    return <p>No booking found. Please start again.</p>;
  }

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "500px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <h2>Payment</h2>
      <p>Booking ID: {bookingId}</p>
      <p>Amount to pay: ₹{totalAmount}</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handlePay} disabled={processing}>
        {processing ? "Processing Payment..." : "Pay Now"}
      </button>
    </div>
  );
}

export default PaymentPage;
