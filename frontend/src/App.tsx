import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoomsList from "./pages/RoomsList";
import BookingPage from "./pages/BookingPage";
import PaymentPage from "./pages/PaymentPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import MyBookings from "./pages/MyBookings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoomsList />} />
        <Route path="/booking/:roomId" element={<BookingPage />} />
        <Route path="/payment/:bookingId" element={<PaymentPage />} />
        <Route path="/confirmation/:bookingId" element={<ConfirmationPage />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
