import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const RecentEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axiosClient.get("/api/events/recent");
        setEvents(res.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-[#0069a8] mb-10">
        Recent Events
      </h1>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white shadow-md hover:shadow-xl hover:-translate-y-2 rounded-2xl overflow-hidden border border-gray-200 transition-all duration-300 flex flex-col group"
          >
            <div className="relative w-full h-52 md:h-60 lg:h-64 overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            <div className="p-6 flex flex-col flex-1">
              <h2 className="text-2xl font-bold mb-3 text-[#0069a8]">
                {event.title}
              </h2>

              <div className="text-sm text-gray-500 space-y-1 mb-4">
                <p>
                  <strong>Category:</strong> {event.category} |{" "}
                  <strong>Location:</strong> {event.location}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(event.date).toLocaleDateString()} | <strong>Time:</strong>{" "}
                  {event.start_time || event.startTime} - {event.end_time || event.endTime}
                </p>
                <p>
                  <strong>Price:</strong> ${event.price} |{" "}
                  <strong>Available Seats:</strong> {event.available_seats || event.availableSeats}
                </p>
              </div>

              <Link
                to={`/all-events/${event.id}`}
                className="mt-auto px-6 py-3 rounded-xl font-semibold text-center transition-colors duration-300 text-white bg-[#0069a8] hover:bg-[#0092b8] cursor-pointer"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentEvents;
