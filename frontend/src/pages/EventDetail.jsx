import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [registering, setRegistering] = useState(false);

  const fetchEvent = async () => {
    const { data } = await api.get(`/events/${id}`);
    setEvent(data);
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    if (!user) return navigate("/login");
    setRegistering(true);
    try {
      await api.post(`/registrations/${id}`);
      toast.success("Registered! Check your email / My Tickets for your QR ticket.");
      fetchEvent();
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setRegistering(false);
    }
  };

  if (!event) return <p className="text-center py-16 text-gray-500">Loading...</p>;

  const seatsLeft = event.seatsLeft ?? Math.max(event.capacity - event.registeredCount, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="h-64 bg-gray-100">
          {event.poster ? (
            <img src={event.poster} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No poster</div>
          )}
        </div>
        <div className="p-6">
          <span className="text-xs font-semibold text-primary-600 uppercase">{event.category}</span>
          <h1 className="text-2xl font-bold mt-1">{event.title}</h1>
          <p className="text-gray-500 mt-1">
            {new Date(event.date).toDateString()} • {event.time} • {event.location}
          </p>
          <p className="mt-4 text-gray-700 whitespace-pre-line">{event.description}</p>
          <p className="mt-4 text-sm text-gray-500">Organized by {event.organizer?.name}</p>
          <div className="mt-6 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">{seatsLeft} seats left</span>
            <button
              onClick={handleRegister}
              disabled={registering || seatsLeft <= 0}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {seatsLeft <= 0 ? "Fully Booked" : registering ? "Registering..." : "Register for Event"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
