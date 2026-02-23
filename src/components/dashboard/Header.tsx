import { Search, MessageSquare, Bell } from "lucide-react";
import styles from "./Header.module.scss";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay, format } from "date-fns";

interface HeaderProps {
    user: { name?: string | null };
}

export default async function Header({ user }: HeaderProps) {
    const session = await auth();
    const firstName = user?.name?.split(" ")[0] || "Student";

    let todayClassesCount = 0;
    let incompleteTodosCount = 0;
    let nextExamStr = "None scheduled";

    if (session?.user?.id) {
        const todayStart = startOfDay(new Date());
        const todayEnd = endOfDay(new Date());

        try {
            const [classesCount, todosCount, nextExam] = await Promise.all([
                // Count classes scheduled for today
                prisma.event.count({
                    where: {
                        userId: session.user.id,
                        type: "class",
                        date: {
                            gte: todayStart,
                            lte: todayEnd,
                        }
                    }
                }),
                // Count all active incomplete to-dos
                prisma.task.count({
                    where: {
                        userId: session.user.id,
                        isCompleted: false,
                    }
                }),
                // Find nearest upcoming exam
                prisma.event.findFirst({
                    where: {
                        userId: session.user.id,
                        type: "exam",
                        date: {
                            gte: todayStart, // from today onwards
                        }
                    },
                    orderBy: {
                        date: "asc"
                    }
                })
            ]);

            todayClassesCount = classesCount;
            incompleteTodosCount = todosCount;

            if (nextExam) {
                nextExamStr = format(new Date(nextExam.date), "MMMM d, yyyy");
            }

        } catch (error) {
            console.error("Failed to fetch header stats:", error);
        }
    }

    return (
        <header className={styles.header}>
            <div className={styles.greetingSection}>
                <h1 className={styles.greeting}>Hello, {firstName}!</h1>
                <p className={styles.subtitle}>
                    You have today <span className={styles.highlight}>{todayClassesCount} class{todayClassesCount !== 1 ? 'es' : ''} & {incompleteTodosCount} to-do{incompleteTodosCount !== 1 ? 's' : ''}</span>,
                    Upcoming exam: {nextExamStr}
                </p>
            </div>

            <div className={styles.actionsSection}>
                {/* <div className={styles.searchBar}>
                    <input
                        type="text"
                        placeholder="Search Anything..."
                        className={styles.searchInput}
                    />
                    <button className={styles.searchBtn}>
                        <Search size={18} color="white" />
                    </button>
                </div> */}

                {/* <button className={styles.iconBtn}>
                    <MessageSquare size={20} />
                </button> */}

                <button className={styles.iconBtn}>
                    <Bell size={20} />
                    <span className={styles.notificationDot}></span>
                </button>
            </div>
        </header>
    );
}
