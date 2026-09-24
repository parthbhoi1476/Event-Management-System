import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import axiosClient from "../api/axiosClient";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const currentDate = new Date();
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axiosClient.get(`/api/events/${id}`);
        setEvent(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) fetchEvent();
  }, [id]);

  if (!event) return <Loading />;

  const eventDate = new Date(event.date);

  const handleBookingSubmit = async () => {
    if (!user) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to book a ticket.",
        icon: "warning",
      });
      return;
    }

    const bookingData = {
      eventId: event.id,
      userEmail: user?.email,
    };

    try {
      const res = await axiosClient.post("/api/booking", bookingData);

      if (res.status === 201) {
        Swal.fire({
          title: "Booked!",
          text: "Your ticket has been successfully booked.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Booking error:", error);
      Swal.fire({
        title: "Booking Failed",
        text: error.response?.data?.error || "Something went wrong.",
        icon: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f5faff] py-10 px-4 flex justify-center items-start">
      <div className="max-w-5xl w-full bg-white shadow-lg rounded-2xl overflow-hidden border border-[#0092b8]/20">
        {/* IMAGE */}
        <div className="relative w-full h-[420px] overflow-hidden">
          <Link
            to="/all-events"
            className="absolute top-4 left-4 z-20 bg-cyan-100 text-gray-800 px-4 py-2 rounded-lg backdrop-blur-md shadow hover:bg-cyan-200 transition font-medium"
          >
            ← Back
          </Link>
          <img
            src={event.image}
            alt={event.title}
            className="object-cover object-center w-full h-full"
          />
        </div>

        {/* CONTENT */}
        <div className="p-8 space-y-6">
          <div>
            <span className="px-3 py-1 text-sm bg-[#006aa9]/10 text-[#006aa9] rounded-full">
              {event.category}
            </span>
            <h1 className="text-3xl font-bold mt-3 text-[#006aa9]">
              {event.title}
            </h1>
            <p className="text-gray-600 mt-2">{event.description}</p>
          </div>

          {/* GRID INFO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div className="bg-[#0092b8]/10 p-5 rounded-xl border border-[#0092b8]/20">
              <p className="text-sm text-gray-500">Location</p>
              <h2 className="text-lg font-semibold text-[#006aa9]">
                {event.location}
              </h2>
            </div>

            <div className="bg-[#0092b8]/10 p-5 rounded-xl border border-[#0092b8]/20">
              <p className="text-sm text-gray-500">Date</p>
              <h2 className="text-lg font-semibold text-[#006aa9]">
                {eventDate.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </h2>
            </div>

            <div className="bg-[#0092b8]/10 p-5 rounded-xl border border-[#0092b8]/20">
              <p className="text-sm text-gray-500">Time</p>
              <h2 className="text-lg font-semibold text-[#006aa9]">
                {event.start_time || event.startTime} - {event.end_time || event.endTime}
              </h2>
            </div>

            <div className="bg-[#0092b8]/10 p-5 rounded-xl border border-[#0092b8]/20">
              <p className="text-sm text-gray-500">Ticket Price</p>
              <h2 className="text-lg font-semibold text-[#006aa9]">
                ৳ {event.price}
              </h2>
            </div>

            <div className="bg-[#0092b8]/10 p-5 rounded-xl border border-[#0092b8]/20">
              <p className="text-sm text-gray-500">Capacity</p>
              <h2 className="text-lg font-semibold text-[#006aa9]">
                {event.capacity}
              </h2>
            </div>

            <div className="bg-[#0092b8]/10 p-5 rounded-xl border border-[#0092b8]/20">
              <p className="text-sm text-gray-500">Available Seats</p>
              <h2 className="text-lg font-semibold text-[#006aa9]">
                {event.available_seats || event.availableSeats}
              </h2>
            </div>
          </div>

          {/* ORGANIZER INFO */}
          <div className="mt-6 bg-[#006aa9]/10 p-6 rounded-xl border border-[#006aa9]/20">
            <h3 className="text-xl font-bold text-[#006aa9] mb-3">
              Organizer Information
            </h3>
            <p className="text-gray-700">
              <span className="font-semibold text-[#006aa9]">Name:</span>{" "}
              {event.organizer_name || event.organizerName}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold text-[#006aa9]">Email:</span>{" "}
              {event.organizer_email || event.organizerEmail}
            </p>
          </div>

          {/* STATUS & BOOK BUTTON */}
          <div className="mt-4 flex justify-between items-center">
            <span
              className={`px-4 py-2 w-max text-sm font-semibold rounded-full ${
                eventDate > currentDate
                  ? "bg-green-200 text-green-800"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {eventDate > currentDate ? "Upcoming" : "Completed"}
            </span>

            <button
              onClick={handleBookingSubmit}
              disabled={eventDate <= currentDate}
              className={`px-6 py-3 rounded-xl font-medium shadow-md text-white transition cursor-pointer ${
                eventDate > currentDate
                  ? "bg-[#006aa9] hover:bg-[#0092b8]"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {eventDate > currentDate ? "Book Ticket" : "Completed"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
