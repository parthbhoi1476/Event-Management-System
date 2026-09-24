import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Lenis from "lenis";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AllEvents from "./pages/AllEvents";
import EventDetail from "./pages/EventDetail";
import CreateEvent from "./pages/CreateEvent";
import MyEvents from "./pages/MyEvents";
import EditEvent from "./pages/EditEvent";
import TicketBooking from "./pages/TicketBooking";
import Profile from "./pages/Profile";

import AdminRoute from "./components/AdminRoute";
import AdminPanel from "./pages/AdminPanel";

function ScrollProvider({ children }) {
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollProvider>
        <Routes>
          {/* Auth pages — no Navbar/Footer */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin layouts - no standard Navbar/Footer */}
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />

          {/* Main layout pages */}
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <div className="min-h-[49vh]">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/all-events" element={<AllEvents />} />
                    <Route path="/all-events/:id" element={<EventDetail />} />
                    <Route path="/create-event" element={<AdminRoute><CreateEvent /></AdminRoute>} />
                    <Route path="/my-events" element={<AdminRoute><MyEvents /></AdminRoute>} />
                    <Route path="/my-events/edit/:id" element={<AdminRoute><EditEvent /></AdminRoute>} />
                    <Route path="/ticket-booking" element={<TicketBooking />} />
                    <Route path="/profile" element={<Profile />} />
                  </Routes>
                </div>
                <Footer />
              </>
            }
          />
        </Routes>
      </ScrollProvider>
    </BrowserRouter>
  );
}
