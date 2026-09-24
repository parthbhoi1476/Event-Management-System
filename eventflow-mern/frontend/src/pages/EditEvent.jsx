import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../context/AuthContext";
import ProtectRoute from "../components/ProtectRoute";
import Loading from "../components/Loading";
import axiosClient from "../api/axiosClient";

const EditEvent = () => {
  const { user, isAuthenticated, status } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eventDate, setEventDate] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (status === "loading" || !user) return;

    const fetchEvent = async () => {
      try {
        const res = await axiosClient.get(`/api/events/${id}`);
        setEvent(res.data);
        reset(res.data);
        if (res.data.date) {
            setEventDate(new Date(res.data.date));
        }
      } catch (error) {
        console.error("Failed to fetch event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, user, status, reset]);

  if (status === "loading" || loading) return <Loading />;
  if (!isAuthenticated) return <ProtectRoute />;

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-gray-800">Event not found</h2>
        <p className="text-gray-600">The event you are looking for does not exist or has been deleted.</p>
      </div>
    );
  }

  // Check if the current user is the owner
  if (event.owner_email !== user.email && event.ownerEmail !== user.email) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
        <p className="text-gray-600">You do not have permission to edit this event.</p>
      </div>
    );
  }

  const onSubmit = async (data) => {
    if (!eventDate) {
      Swal.fire("Error", "Please select a valid date!", "error");
      return;
    }

    data.date = eventDate.toISOString();
    
    // Convert back from snake_case standard to avoid issues
    if(!data.organizerName && data.organizer_name) data.organizerName = data.organizer_name;
    if(!data.organizerEmail && data.organizer_email) data.organizerEmail = data.organizer_email;
    if(!data.availableSeats && typeof data.available_seats !== "undefined") data.availableSeats = data.available_seats;
    if(!data.startTime && data.start_time) data.startTime = data.start_time;
    if(!data.endTime && data.end_time) data.endTime = data.end_time;
    
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update this event?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Update Event",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosClient.put(`/api/events/${id}`, data);
      Swal.fire({
        title: "Event Updated!",
        text: "Your event has been successfully updated.",
        icon: "success",
        confirmButtonText: "OK",
      });
      navigate("/my-events");
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Something went wrong. Try again.",
        icon: "error",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-7 py-10">
      <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-center mb-10 text-[#0A66C2]">
          Edit Event
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Event Title</label>
            <input
              {...register("title", { required: true })}
              placeholder="Event Title"
              className="input-style"
            />
            {errors.title && <p className="error-text">Title is required</p>}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Category</label>
            <input
              {...register("category", { required: true })}
              placeholder="Category"
              className="input-style"
            />
            {errors.category && (
              <p className="error-text">Category is required</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Location</label>
            <input
              {...register("location", { required: true })}
              placeholder="Location"
              className="input-style"
            />
            {errors.location && (
              <p className="error-text">Location is required</p>
            )}
          </div>

          <div className="flex flex-col w-full">
            <label className="text-sm font-semibold text-gray-700 mb-1">Event Date</label>
            <DatePicker
              selected={eventDate}
              onChange={(date) => setEventDate(date)}
              minDate={new Date()}
              placeholderText="Select Event Date"
              className="input-style w-full"
              dateFormat="yyyy-MM-dd"
            />
            {!eventDate && <p className="error-text">Date is required</p>}
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                {...register("startTime", { required: true })}
                defaultValue={event.start_time || event.startTime}
                className="input-style"
              />
              {errors.startTime && (
                <p className="error-text">Start time required</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                {...register("endTime", { required: true })}
                defaultValue={event.end_time || event.endTime}
                className="input-style"
              />
              {errors.endTime && <p className="error-text">End time required</p>}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Ticket Price</label>
            <input
              type="number"
              {...register("price", { required: true })}
              placeholder="Ticket Price"
              className="input-style"
            />
            {errors.price && <p className="error-text">Price is required</p>}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Total Seats</label>
            <input
              type="number"
              {...register("capacity", { required: true })}
              placeholder="Total Seats"
              className="input-style"
            />
            {errors.capacity && (
              <p className="error-text">Capacity is required</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Available Seats</label>
            <input
              type="number"
              {...register("availableSeats", { required: true })}
              defaultValue={event.available_seats || event.availableSeats}
              placeholder="Available Seats"
              className="input-style"
            />
            {errors.availableSeats && (
              <p className="error-text">Available seats required</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Organizer Name</label>
            <input
              {...register("organizerName", { required: true })}
              defaultValue={event.organizer_name || event.organizerName}
              placeholder="Organizer Name"
              className="input-style"
            />
            {errors.organizerName && (
              <p className="error-text">Organizer name required</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Organizer Email</label>
            <input
              type="email"
              {...register("organizerEmail", { required: true })}
              defaultValue={event.organizer_email || event.organizerEmail}
              placeholder="Organizer Email"
              className="input-style"
            />
            {errors.organizerEmail && (
              <p className="error-text">Organizer email required</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Owner Email (Read Only)</label>
            <input
              {...register("ownerEmail")}
              defaultValue={event.owner_email || event.ownerEmail}
              readOnly
              className="input-style bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Image URL</label>
            <input
              {...register("image", { required: true })}
              placeholder="Image URL"
              className="input-style"
            />
            {errors.image && <p className="error-text">Image URL required</p>}
          </div>

          <div className="flex flex-col lg:col-span-2">
            <label className="text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              {...register("description", { required: true })}
              placeholder="Description"
              className="input-style h-32 resize-none"
            />
            {errors.description && (
              <p className="error-text">Description is required</p>
            )}
          </div>

          <button
            type="submit"
            className="lg:col-span-2 bg-gradient-to-r from-[#0072FF] to-[#00C6FF] text-white font-semibold py-3 rounded-lg mt-4 hover:opacity-90 transition cursor-pointer"
          >
            Update Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
