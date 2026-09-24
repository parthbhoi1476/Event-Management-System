import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import ProtectRoute from "../components/ProtectRoute";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../api/axiosClient";
import { jsPDF } from "jspdf";

const TicketBooking = () => {
  const { user, isAuthenticated, status } = useAuth();
  const isLoaded = status !== "loading";
  const [events, setEvents] = useState([]);
  const currentDate = new Date();

  const userEmail = user?.email?.toLowerCase();

  useEffect(() => {
    if (!userEmail) return;

    const fetchEvents = async () => {
      try {
        const res = await axiosClient.get(`/api/booking?email=${encodeURIComponent(userEmail)}`);
        setEvents(res.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchEvents();
  }, [userEmail]);

  if (!isLoaded) return null;
  if (!isAuthenticated) return <ProtectRoute />;

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Cancel Ticket?",
      text: "You won't be able to revert this! Your seat will be given up.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "Keep Ticket",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosClient.delete(`/api/booking/${id}`);

        if (res.status === 200) {
          setEvents((prevEvents) =>
            prevEvents.filter((event) => event.id !== id)
          );
          Swal.fire({
            title: "Cancelled!",
            text: "Your ticket has been cancelled and seat freed.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        console.error("Error deleting event:", error);
        Swal.fire({
          title: "Error!",
          text: "Something went wrong. Check console.",
          icon: "error",
        });
      }
    }
  };

  const handleDownload = (event) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(0, 105, 169); // #0069a9
    doc.text("EventFlow Ticket", 20, 30);
    
    // Divider
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 40, 190, 40);
    
    // Body
    doc.setFontSize(16);
    doc.setTextColor(50, 50, 50);
    doc.text(`Event: ${event.eventTitle}`, 20, 60);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${new Date(event.eventDate).toLocaleDateString()}`, 20, 75);
    doc.text(`Attendee: ${user?.name}`, 20, 90);
    doc.text(`Email: ${user?.email}`, 20, 105);
    doc.text(`Status: CONFIRMED`, 20, 120);
    
    // Footer
    doc.line(20, 140, 190, 140);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Please present this digital ticket at the entrance.", 20, 150);
    doc.text(`Booking Reference: BKG-${event.id}-${event.event_id}`, 20, 160);
    
    doc.save(`Ticket_${event.eventTitle.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-6 text-[#0069a9]">
        My Booked Tickets
      </h1>

      {events.length === 0 ? (
        <p className="text-gray-500 text-center text-lg mt-10">
          You haven’t booked any tickets yet.
        </p>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300 shadow-lg rounded-lg overflow-hidden">
              <thead className="bg-[#0069a9] text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Image</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-100 divide-y divide-gray-300">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-4 py-3">
                      <div className="w-20 h-16 relative">
                        <img
                          src={event.eventImage}
                          alt={event.eventTitle}
                          className="w-full h-full object-cover rounded-md border"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {event.eventTitle}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {new Date(event.eventDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 w-max text-sm font-medium rounded-full ${
                          new Date(event.eventDate) > currentDate
                            ? "bg-green-200 text-green-800"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {new Date(event.eventDate) > currentDate ? "Upcoming" : "Completed"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/all-events/${event.event_id}`}
                          className="bg-[#0069a9] hover:bg-[#0092b8] text-white px-3 py-1 rounded-md text-sm transition"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDownload(event)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm transition cursor-pointer"
                        >
                          Download PDF
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition cursor-pointer"
                        >
                          Cancel Ticket
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden flex flex-col gap-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-300"
              >
                <div className="relative w-full h-40 sm:h-48">
                  <img
                    src={event.eventImage}
                    alt={event.eventTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex flex-col gap-2">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {event.eventTitle}
                  </h2>
                  <p className="text-gray-600">
                    Date: {new Date(event.eventDate).toLocaleDateString()}
                  </p>
                  <span
                    className={`px-2 py-1 w-max text-sm font-medium rounded-full ${
                      new Date(event.eventDate) > currentDate
                        ? "bg-green-200 text-green-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {new Date(event.eventDate) > currentDate ? "Upcoming" : "Completed"}
                  </span>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Link
                      to={`/all-events/${event.event_id}`}
                      className="bg-[#0069a9] hover:bg-[#0092b8] text-white px-3 py-1 rounded-md text-sm transition"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDownload(event)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm transition"
                    >
                      Download PDF
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition"
                    >
                      Cancel Ticket
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TicketBooking;
