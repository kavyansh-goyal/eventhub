import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const { data } = await api.get("/registrations/mine");
      setTickets(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCancel = async (id) => {
    if (!confirm("Cancel this ticket?")) return;
    try {
      await api.delete(`/registrations/${id}`);
      toast.success("Ticket cancelled");
      fetchTickets();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel");
    }
  };

  if (loading) return <p className="text-center py-16 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Tickets</h1>
      {tickets.length === 0 ? (
        <p className="text-gray-500">You haven't registered for any events yet.</p>
      ) : (
        <div className="space-y-4">
          {tickets.map((t) => (
            <div key={t._id} className="bg-white rounded-xl shadow-sm border p-5 flex gap-5 items-center">
              <img src={t.qrCode} alt="QR ticket" className="w-28 h-28 border rounded-lg" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{t.event?.title}</h3>
                <p className="text-sm text-gray-500">
                  {t.event?.date && new Date(t.event.date).toDateString()} • {t.event?.time}
                </p>
                <p className="text-sm text-gray-500">{t.event?.location}</p>
                <p className="text-xs text-gray-400 mt-1">Ticket ID: {t.ticketId}</p>
                <span
                  className={`inline-block mt-2 text-xs font-semibold px-2 py-1 rounded-full ${
                    t.status === "attended"
                      ? "bg-green-100 text-green-700"
                      : t.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-primary-100 text-primary-700"
                  }`}
                >
                  {t.status}
                </span>
              </div>
              {t.status === "registered" && (
                <button
                  onClick={() => handleCancel(t._id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;
