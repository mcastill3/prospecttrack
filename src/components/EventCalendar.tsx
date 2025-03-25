"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

// Función para comparar si dos fechas están en el mismo mes y año
const isSameMonthYear = (date1: Date, date2: Date) => {
  return (
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const getEventsAndCampaigns = async () => {
      const response = await fetch('/api/event');
      const data = await response.json();
      setEvents(data);
    };

    getEventsAndCampaigns();
  }, []);

  const filteredItems = events.filter((item) =>
    isSameMonthYear(new Date(item.date), value as Date)
  );

  return (
    <div className="bg-white p-4 rounded-md">
      <Calendar onChange={onChange} value={value} />
      <div className="flex items-center justify-between mt-4">
        <h1 className="text-lg font-semibold text-gray-700">Activities</h1>
        <Image
          src="/moreDark.png"
          alt=""
          width={18}
          height={18}
          className="cursor-pointer"
        />
      </div>

      <div className="mt-3 space-y-2">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              className="p-3 rounded-md border border-gray-200 shadow-sm flex flex-col gap-1.5 odd:border-t-lamaSky even:border-t-lamaPurple"
              key={item.id}
            >
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-semibold text-gray-700">{item.name}</h1>
                <div className="px-2 py-1 text-xs text-white bg-black rounded-full flex gap-1 items-center">
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                  <span>
                    {new Date(item.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-500">{item.type}</p>

              <span className="text-xs text-gray-600">
                {item.confirmedAttendees || item.targetContacts}{" "}
                {item.confirmedAttendees ? "Confirmed Attendees" : "Target Contacts"}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No activities scheduled for this month.</p>
        )}
      </div>
    </div>
  );
};

export default EventCalendar;