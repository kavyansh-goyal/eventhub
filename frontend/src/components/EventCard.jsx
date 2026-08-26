import React from "react";
import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  const dateStr = new Date(event.date).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      to={`/events/${event._id}`}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100"
    >
      <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
        {event.poster ? (
          <img src={event.poster} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-sm">No poster</span>
        )}
      </div>
      <div className="p-4">
        <span className="text-xs font-semibold text-primary-600 uppercase">{event.category}</span>
        <h3 className="font-semibold text-lg mt-1 truncate">{event.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{dateStr} • {event.time}</p>
        <p className="text-sm text-gray-500 truncate">{event.location}</p>
        <div className="mt-3 text-xs font-medium text-gray-600">
          {event.seatsLeft ?? Math.max((event.capacity || 0) - (event.registeredCount || 0), 0)} seats left
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
