import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios.js";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "General",
    date: "",
    time: "",
    location: "",
    capacity: 100,
  });
  const [poster, setPoster] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (poster) fd.append("poster", poster);

      const { data } = await api.post("/events", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Event created!");
      navigate(`/events/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create a New Event</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
        <input
          required
          placeholder="Event title"
          className="w-full border rounded-lg px-3 py-2"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          required
          placeholder="Description"
          rows={4}
          className="w-full border rounded-lg px-3 py-2"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Category"
            className="border rounded-lg px-3 py-2"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <input
            type="number"
            min={1}
            placeholder="Capacity"
            className="border rounded-lg px-3 py-2"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            required
            className="border rounded-lg px-3 py-2"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <input
            type="time"
            required
            className="border rounded-lg px-3 py-2"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
          />
        </div>
        <input
          required
          placeholder="Location"
          className="w-full border rounded-lg px-3 py-2"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Event Poster</label>
          <input type="file" accept="image/*" onChange={(e) => setPoster(e.target.files[0])} />
        </div>
        <button
          disabled={loading}
          className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
