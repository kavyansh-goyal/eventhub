import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";

const Attendance = () => {
  const [ticketId, setTicketId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post("/attendance/check-in", { ticketId });
      setResult({ success: true, data });
      toast.success("Attendee checked in!");
    } catch (err) {
      setResult({ success: false, message: err.response?.data?.message });
      toast.error(err.response?.data?.message || "Check-in failed");
    } finally {
      setLoading(false);
      setTicketId("");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Attendance Check-In</h1>
      <p className="text-gray-500 mb-6 text-sm">
        Scan the attendee's QR code with any scanner app (or a phone camera) to get the ticket ID,
        then paste/type it below to mark them present.
      </p>

      <form onSubmit={handleCheckIn} className="bg-white p-6 rounded-xl shadow-sm border flex gap-3">
        <input
          required
          autoFocus
          placeholder="Scan or paste Ticket ID"
          className="flex-1 border rounded-lg px-3 py-2"
          value={ticketId}
          onChange={(e) => setTicketId(e.target.value)}
        />
        <button
          disabled={loading}
          className="bg-primary-600 text-white px-5 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? "Checking..." : "Check In"}
        </button>
      </form>

      {result && (
        <div
          className={`mt-6 p-4 rounded-xl border ${
            result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
          }`}
        >
          {result.success ? (
            <>
              <p className="font-semibold text-green-700">✓ Checked in</p>
              <p className="text-sm text-gray-700 mt-1">
                {result.data.registration.user.name} ({result.data.registration.user.email})
              </p>
              <p className="text-sm text-gray-500">{result.data.registration.event.title}</p>
            </>
          ) : (
            <p className="font-semibold text-red-700">✗ {result.message}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Attendance;
