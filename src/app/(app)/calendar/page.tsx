import Header from "@/components/dashboard/Header";
import { auth } from "@/lib/auth";
import styles from "./calendar.module.scss";
import CalendarClient from "@/components/calendar/CalendarClient";
import { getAllCalendarData } from "@/app/actions/calendarActions";

export default async function CalendarPage() {
    const session = await auth();
    const user = session?.user || { name: "Student", image: null, collegeName: "Demo College" };

    // Fetch dynamic calendar data securely from the database on the server
    const { tasks, events } = await getAllCalendarData();

    return (
        <div className={styles.calendarLayout}>
            <Header user={user} />
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1>Calendar</h1>
                    <p className={styles.subtitle}>Overview of your monthly schedule</p>
                </div>

                {/* Mount the interactive Client Component with pre-fetched server data */}
                <CalendarClient initialTasks={tasks} initialEvents={events} />
            </div>
        </div>
    );
}
