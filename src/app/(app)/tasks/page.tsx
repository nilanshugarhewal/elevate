import NotesWidget from "@/components/tasks/NotesWidget";
import FocusTimer from "@/components/tasks/FocusTimer";
import TodoList from "@/components/dashboard/TodoList"; // Reusing the great todo list from the dashboard
import styles from "./tasks.module.scss";

export default async function TasksPage() {
    return (
        <div className={styles.tasksContainer}>
            <div className={styles.header}>
                <h1>Tasks & Focus</h1>
                <p className={styles.subtitle}>Manage your time and capture ideas</p>
            </div>

            <div className={styles.grid}>
                <div className={styles.mainCol}>
                    <NotesWidget />
                </div>

                <div className={styles.sideCol}>
                    <div className={styles.timerWrapper}>
                        <FocusTimer />
                    </div>
                    <div className={`${styles.todoWrapper} glass-panel`}>
                        <TodoList />
                    </div>
                </div>
            </div>
        </div>
    );
}
