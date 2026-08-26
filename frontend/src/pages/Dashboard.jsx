import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/events/mine/list");
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="text-center py-16 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Events Dashboard</h1>
        <Link to="/create-event" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
          + Create Event
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="text-gray-500">You haven't created any events yet.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Date</th>
                <th className="p-3">Registered</th>
                <th className="p-3">Capacity</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev._id} className="border-t">
                  <td className="p-3 font-medium">{ev.title}</td>
                  <td className="p-3">{new Date(ev.date).toDateString()}</td>
                  <td className="p-3">{ev.registeredCount}</td>
                  <td className="p-3">{ev.capacity}</td>
                  <td className="p-3 text-right">
                    <Link to={`/events/${ev._id}`} className="text-primary-600 hover:underline mr-3">
                      View
                    </Link>
                    <Link to={`/attendance?eventId=${ev._id}`} className="text-primary-600 hover:underline">
                      Attendance
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
