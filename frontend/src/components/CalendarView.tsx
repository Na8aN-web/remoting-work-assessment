import React from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { Task } from "../types";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { enUS } from "date-fns/locale/en-US";

interface CalendarViewProps {
    tasks: Task[];
}

const locales = {
    "en-US": enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const CalendarView: React.FC<CalendarViewProps> = ({ tasks }) => {
    const events = tasks
        .filter((task) => task.dueDate) // Only include tasks with a due date
        .map((task) => ({
            title: task.title,
            start: new Date(task.dueDate!),
            end: new Date(task.dueDate!), // Single-day events
        }));

    return (
        <div className="my-6 mx-auto w-full p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
                Calendar View
            </h2>
            <div className="h-96 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-900 rounded-lg shadow-md overflow-hidden">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: "100%", borderRadius: "8px" }}
                    views={['month']} // Ensure it's showing the month view
                    step={60} // Hour steps
                    showMultiDayTimes={true}
                    messages={{
                        today: "Today",
                        previous: "Prev",
                        next: "Next",
                    }}
                    components={{
                        event: ({ event }: any) => (
                            <div className="bg-blue-500 text-white text-sm p-1 rounded-md">
                                {event.title}
                            </div>
                        ),
                    }}
                />
            </div>
        </div>
    );
};

export default CalendarView;
