"use client";

import { useTransition } from "react";
import { RotateCcw } from "lucide-react";
import styles from "./AvgPerformance.module.scss";
import { clearCompletedTasks } from "@/app/actions/taskActions";
import { subDays, startOfDay } from "date-fns";

type StudySession = {
    id: string;
    durationMinutes: number;
    type: string;
    date: Date;
};

type Task = {
    id: string;
    title: string;
    isCompleted: boolean;
    updatedAt: Date;
};

interface AvgPerformanceProps {
    sessions: StudySession[];
    tasks: Task[];
}

export default function AvgPerformance({ sessions, tasks }: AvgPerformanceProps) {
    const [isPending, startTransition] = useTransition();

    // 1. Calculate Average Study Hours (Past 7 Days strictly)
    const todayStr = startOfDay(new Date());
    const sevenDaysAgo = subDays(todayStr, 6);

    const validSessions = sessions.filter(s => {
        const d = new Date(s.date);
        return d >= sevenDaysAgo;
    });

    const totalStudyMin = validSessions
        .filter(s => s.type === "study")
        .reduce((sum, s) => sum + s.durationMinutes, 0);

    // If there is data for 7 days, devide by 7 days. If not, fallback to 1 so we don't divide by 0
    const avgHrsPerDay = parseFloat((totalStudyMin / 60 / 7).toFixed(1));

    // Calculate progress percentage, assuming e.g., 4hrs/day is 100% "Highest Score" tier
    const studyTargetHours = 4;
    const studyProgress = Math.min((avgHrsPerDay / studyTargetHours) * 100, 100).toFixed(0);

    // 2. Calculate Completed Tasks (Past 7 Days)
    const completedTasksLast7Days = tasks.filter(t => {
        if (!t.isCompleted) return false;
        const completeDate = new Date(t.updatedAt);
        return completeDate >= sevenDaysAgo;
    });

    const activeTasksLast7Days = tasks.filter(t => {
        if (t.isCompleted) return false;
        const taskDate = new Date(t.updatedAt);
        return taskDate >= sevenDaysAgo;
    });

    const totalTaskVolume = completedTasksLast7Days.length + activeTasksLast7Days.length;

    // Default task progress if no tasks exist
    const taskProgress = totalTaskVolume > 0
        ? Math.min((completedTasksLast7Days.length / totalTaskVolume) * 100, 100).toFixed(0)
        : "0";

    const handleResetTasks = () => {
        if (confirm("Are you sure you want to reset your completed tasks count? This will permanently delete your completed tasks history.")) {
            startTransition(async () => {
                await clearCompletedTasks();
            });
        }
    };

    return (
        <div className={`${styles.wrapper} glass-panel`}>
            <div className={styles.headerRow}>
                <h3 className={styles.title}>Avg performance</h3>
                <button
                    className={styles.resetBtn}
                    title="Reset Task Progress"
                    onClick={handleResetTasks}
                    disabled={isPending || completedTasksLast7Days.length === 0}
                >
                    <RotateCcw size={14} /> Reset
                </button>
            </div>

            <div className={styles.scoreRow}>
                <span className={styles.mainScore}>{studyProgress}%</span>
            </div>

            <div className={styles.barsContainer}>
                {/* Average Study Hours */}
                <div className={styles.barGroup}>
                    <div className={styles.barHeader}>
                        <span>Avg Study/Day (wk)</span>
                        <span>{avgHrsPerDay} hrs</span>
                    </div>
                    <div className={styles.progressTrack}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${studyProgress}%`, background: '#F4C430' }}
                        ></div>
                    </div>
                </div>

                {/* Tasks Completed */}
                <div className={styles.barGroup}>
                    <div className={styles.barHeader}>
                        <span style={{ color: 'var(--text-secondary)' }}>Tasks Completed (wk)</span>
                        <span style={{ color: 'var(--text-secondary)' }}>
                            {completedTasksLast7Days.length} / {totalTaskVolume}
                        </span>
                    </div>
                    <div className={styles.progressTrack}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${taskProgress}%`, background: '#a3c4f3' }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
