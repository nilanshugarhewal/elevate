"use client";

import { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "@/app/(app)/calendar/calendar.module.scss";

type CalendarTask = {
    id: string;
    title: string;
    createdAt: Date;
    dueDate: Date | null;
    isCompleted: boolean;
};

type CalendarEvent = {
    id: string;
    title: string;
    date: Date;
    type: string;
};

interface CalendarClientProps {
    initialTasks: CalendarTask[];
    initialEvents: CalendarEvent[];
}

export default function CalendarClient({ initialTasks, initialEvents }: CalendarClientProps) {
    // Dynamically default to the CURRENT REAL DATE, not hardcoded 2025
    const [currentDate, setCurrentDate] = useState(new Date());

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const renderHeader = () => {
        return (
            <div className={styles.headerRow}>
                <div className={styles.navGroup}>
                    <button onClick={prevMonth} className={styles.navBtn}>
                        <ChevronLeft size={24} />
                    </button>
                    <span className={styles.monthLabel}>
                        {format(currentDate, "MMMM yyyy")}
                    </span>
                    <button onClick={nextMonth} className={styles.navBtn}>
                        <ChevronRight size={24} />
                    </button>
                </div>

                <div className={styles.legend}>
                    <span className={styles.legendItem}>
                        <span className={`${styles.dot} ${styles.examDot}`}></span> Exam / Class
                    </span>
                    <span className={styles.legendItem}>
                        <span className={`${styles.dot} ${styles.taskDot}`}></span> Task
                    </span>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const days = [];
        const startDate = startOfWeek(new Date()); // Keeps headers Sun-Sat correctly

        for (let i = 0; i < 7; i++) {
            days.push(
                <div className={styles.dayColName} key={i}>
                    {format(addDays(startDate, i), "EEEE")}
                </div>
            );
        }

        return <div className={styles.daysRow}>{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, "d");
                const cloneDay = day;

                // 1. Find live classes and exams for this day
                const dayEvents = initialEvents.filter(e => isSameDay(new Date(e.date), cloneDay));

                // 2. Find tasks for this day (Using createdAt or dueDate)
                // For a to-do, we assume the creation date is relevant for calendar if no due date, otherwise dueDate
                const dayTasks = initialTasks.filter(t => {
                    const targetDate = t.dueDate ? new Date(t.dueDate) : new Date(t.createdAt);
                    return isSameDay(targetDate, cloneDay);
                });

                days.push(
                    <div
                        className={`${styles.cell} ${!isSameMonth(day, monthStart)
                            ? styles.disabled
                            : isSameDay(day, new Date())
                                ? styles.selected
                                : ""
                            }`}
                        key={day.toString()}
                    >
                        <span className={styles.dateNumber}>{formattedDate}</span>
                        <div className={styles.eventsArea}>

                            {/* Render Database Events (Live Classes & Exams) */}
                            {dayEvents.map(event => (
                                <div
                                    key={`event-${event.id}`}
                                    className={`${styles.eventBadge} ${styles.examBadge}`}
                                >
                                    {event.title}
                                </div>
                            ))}

                            {/* Render Database Tasks */}
                            {dayTasks.map(task => (
                                <div
                                    key={`task-${task.id}`}
                                    className={`${styles.eventBadge} ${styles.taskBadge}`}
                                    style={{ textDecoration: task.isCompleted ? 'line-through' : 'none', opacity: task.isCompleted ? 0.6 : 1 }}
                                >
                                    {task.title}
                                </div>
                            ))}

                        </div>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className={styles.row} key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className={styles.body}>{rows}</div>;
    };

    return (
        <div className={`${styles.calendarWidget} glass-panel`}>
            {renderHeader()}
            {renderDays()}
            {renderCells()}
        </div>
    );
}
