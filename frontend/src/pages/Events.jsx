import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import EventCard from "../components/EventCard.jsx";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchEvents = async (query = "") => {
    setLoading(true);
    try {
      const { data } = await api.get(`/events${query ? `?search=${query}` : ""}`);
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents(search);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Upcoming Events</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            placeholder="Search events..."
            className="border rounded-lg px-3 py-2 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-gray-500">No events found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => (
            <EventCard key={ev._id} event={ev} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
