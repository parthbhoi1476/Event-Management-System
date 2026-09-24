import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../context/AuthContext";
import ProtectRoute from "../components/ProtectRoute";
import axiosClient from "../api/axiosClient";

const CreateEvent = () => {
  const { user, isAuthenticated, status } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [eventDate, setEventDate] = useState(null);

  if (status === "loading") return null;
  if (!isAuthenticated) return <ProtectRoute />;

  const onSubmit = async (data) => {
    if (!eventDate) {
      Swal.fire("Error", "Please select a valid date!", "error");
      return;
    }

    data.date = eventDate.toISOString();
    data.ownerEmail = user?.email;
    
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to add this event?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Add Event",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosClient.post("/api/events", data);
      Swal.fire({
        title: "Event Added!",
        text: "Your event has been successfully created.",
        icon: "success",
        confirmButtonText: "OK",
      });
      reset();
      setEventDate(null);
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
          Create Event
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="flex flex-col">
            <input
              {...register("title", { required: true })}
              placeholder="Event Title"
              className="input-style"
            />
            {errors.title && <p className="error-text">Title is required</p>}
          </div>

          <div className="flex flex-col">
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
              <input
                type="time"
                {...register("startTime", { required: true })}
                className="input-style"
              />
              {errors.startTime && (
                <p className="error-text">Start time required</p>
              )}
            </div>

            <div className="flex flex-col">
              <input
                type="time"
                {...register("endTime", { required: true })}
                className="input-style"
              />
              {errors.endTime && <p className="error-text">End time required</p>}
            </div>
          </div>

          <div className="flex flex-col">
            <input
              type="number"
              {...register("price", { required: true })}
              placeholder="Ticket Price"
              className="input-style"
            />
            {errors.price && <p className="error-text">Price is required</p>}
          </div>

          <div className="flex flex-col">
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
            <input
              type="number"
              {...register("availableSeats", { required: true })}
              placeholder="Available Seats"
              className="input-style"
            />
            {errors.availableSeats && (
              <p className="error-text">Available seats required</p>
            )}
          </div>

          <div className="flex flex-col">
            <input
              {...register("organizerName", { required: true })}
              placeholder="Organizer Name"
              className="input-style"
            />
            {errors.organizerName && (
              <p className="error-text">Organizer name required</p>
            )}
          </div>

          <div className="flex flex-col">
            <input
              type="email"
              {...register("organizerEmail", { required: true })}
              placeholder="Organizer Email"
              className="input-style"
            />
            {errors.organizerEmail && (
              <p className="error-text">Organizer email required</p>
            )}
          </div>

          <div className="flex flex-col">
            <input
              {...register("ownerEmail")}
              defaultValue={user?.email}
              readOnly
              className="input-style bg-gray-100 cursor-not-allowed hidden md:block" // We will force populate it onSubmit anyway
              placeholder="Owner Email"
            />
          </div>

          <div className="flex flex-col">
            <input
              {...register("image", { required: true })}
              placeholder="Image URL"
              className="input-style"
            />
            {errors.image && <p className="error-text">Image URL required</p>}
          </div>

          <div className="flex flex-col lg:col-span-2">
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
            Submit Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
