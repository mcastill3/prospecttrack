"use client"

import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useState, useEffect } from 'react'

const localizer = momentLocalizer(moment)

const BigCalendar = () => {
    const [view, setView] = useState<View>(Views.MONTH);
    const [events, setEvents] = useState<any[]>([]);  // Estado para almacenar eventos y campañas

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('/api/event');  // Llamada a la API
                const data = await response.json();
                
                // Transformar los datos para que sean compatibles con react-big-calendar
                const formattedEvents = data.map((item: any) => ({
                    id: item.id,
                    title: item.name,  // Nombre del evento o campaña
                    start: new Date(item.date),  // Fecha de inicio
                    end: new Date(item.date),    // Fecha de fin (ajustar si es necesario)
                    type: item.type,  // Tipo de evento (opcional)
                }));

                setEvents(formattedEvents);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
    }, []);

    const handleOnChangeView = (selectedView: View) => {
        setView(selectedView);
    };

    return (
        <Calendar
            localizer={localizer}
            events={events}  // Usamos los eventos dinámicos
            startAccessor="start"
            endAccessor="end"
            titleAccessor="title"
            views={["month","work_week","day"]}
            view={view}
            style={{ height: "98%" }}
            onView={handleOnChangeView}
            min={new Date(2025, 1, 0, 7, 0, 0)}
            max={new Date(2025, 1, 0, 20, 0, 0)}
        />  
    )
};

export default BigCalendar;
