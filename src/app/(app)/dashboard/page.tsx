import Header from "@/components/dashboard/Header";
import StatsCards from "@/components/dashboard/StatsCards";
import HoursSpentChart from "@/components/dashboard/HoursSpentChart";
import AvgPerformance from "@/components/dashboard/AvgPerformance";
import ProfileSidebar from "@/components/dashboard/ProfileSidebar";
import BottomWidgets from "@/components/dashboard/BottomWidgets";
import TodoList from "@/components/dashboard/TodoList";
import styles from "./dashboard.module.scss";
import { auth } from "@/lib/auth";
import { manageDailyStreak } from "@/app/actions/streakActions";
import { getCourses } from "@/app/actions/courseActions";
import { getChallenges } from "@/app/actions/challengeActions";
import { getWeeklyStudySessions, getUserHoursSpentMode } from "@/app/actions/studySessionActions";
import { getTasks } from "@/app/actions/taskActions";

export default async function DashboardPage() {
    const session = await auth();

    // Calculate real daily login streak
    const { currentStreak } = await manageDailyStreak();

    // Fetch user courses
    const courses = await getCourses();

    // Fetch user challenges (incomplete tasks + upcoming events)
    const challenges = await getChallenges();

    // Fetch user study sessions (for hours spent) and mode
    const weeklySessions = await getWeeklyStudySessions();
    const hoursSpentMode = await getUserHoursSpentMode();

    // Fetch user tasks
    const tasks = await getTasks();

    // Provide a safe fallback if session is still loading
    const user = session?.user || { name: "Student", image: null, collegeName: "Demo College" };

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.mainCol}>
                <Header user={user} />

                <StatsCards streak={currentStreak} courses={courses} challenges={challenges} />

                <div className={styles.chartsRow}>
                    <div className={styles.hoursCol}>
                        <HoursSpentChart sessions={weeklySessions} initialMode={hoursSpentMode as "manual" | "automatic"} />
                    </div>
                    <div className={styles.perfCol}>
                        <AvgPerformance sessions={weeklySessions} tasks={tasks} />
                    </div>
                </div>

                <div className={styles.bottomSection}>
                    <BottomWidgets events={challenges.events} />
                </div>
            </div>

            <aside className={styles.rightLayout}>
                <ProfileSidebar user={user} />
                <div style={{ marginTop: '2rem' }}>
                    <TodoList />
                </div>
            </aside>
        </div>
    );
}
