"use client";

import { useState, useTransition } from "react";
import { BookOpen, Trophy, Target, Flame, X, Plus, CheckCircle, Trash2, Undo2, Calendar, ListTodo } from "lucide-react";
import { addCourse, markCourseCompleted, deleteCourse, unmarkCourseCompleted } from "@/app/actions/courseActions";
import styles from "./StatsCards.module.scss";

type Course = {
    id: string;
    name: string;
    status: string;
};

type Task = {
    id: string;
    title: string;
    dueDate: Date | null;
};

type Event = {
    id: string;
    title: string;
    date: Date;
    type: string;
    courseName?: string | null;
    time?: string | null;
    link?: string | null;
};

interface StatsCardsProps {
    streak: number;
    courses?: Course[];
    challenges?: {
        tasks: Task[];
        events: Event[];
    };
}

export default function StatsCards({ streak, courses = [], challenges = { tasks: [], events: [] } }: StatsCardsProps) {
    const [isPending, startTransition] = useTransition();

    // Modals State
    const [isTotalModalOpen, setIsTotalModalOpen] = useState(false);
    const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);
    const [isChallengesModalOpen, setIsChallengesModalOpen] = useState(false);

    const [newCourseName, setNewCourseName] = useState("");

    const activeCourses = courses.filter(c => c.status === "active");
    const completedCourses = courses.filter(c => c.status === "completed");

    const totalCoursesCount = courses.length;
    const completedCoursesCount = completedCourses.length;

    const totalChallengesCount = challenges.tasks.length + challenges.events.length;

    const handleAddCourse = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCourseName.trim()) return;

        startTransition(async () => {
            const formData = new FormData();
            formData.append("name", newCourseName);
            await addCourse(formData);
            setNewCourseName("");
        });
    };

    const handleMarkCompleted = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        startTransition(async () => {
            await markCourseCompleted(id);
        });
    };

    const handleUnmarkCompleted = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        startTransition(async () => {
            await unmarkCourseCompleted(id);
        });
    };

    const handleDeleteCourse = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        startTransition(async () => {
            await deleteCourse(id);
        });
    };

    const stats = [
        {
            title: "Total Courses",
            value: totalCoursesCount.toString(),
            subtitle: `${activeCourses.length} Active`,
            icon: BookOpen,
            iconColor: "#8a8d93",
            bgColor: "white",
            onClick: () => setIsTotalModalOpen(true),
            clickable: true,
        },
        {
            title: "Completed",
            value: completedCoursesCount.toString(),
            subtitle: "Great job!",
            icon: Trophy,
            iconColor: "#679267", // Green
            bgColor: "white",
            onClick: () => setIsCompletedModalOpen(true),
            clickable: true,
        },
        {
            title: "Challenges",
            value: totalChallengesCount.toString(),
            subtitle: totalChallengesCount > 0 ? `${challenges.tasks.length} To-dos, ${challenges.events.length} Classes` : "All caught up",
            icon: Target,
            iconColor: totalChallengesCount > 0 ? "#ffadad" : "#8a8d93", // Red/Pink
            bgColor: "white",
            onClick: () => setIsChallengesModalOpen(true),
            clickable: true,
        },
        {
            title: "Total Streak",
            value: streak.toString(),
            unit: "days",
            subtitle: streak >= 30 ? "Pro level" : (streak >= 7 ? "On Fire!" : "Getting started"),
            icon: Flame,
            iconColor: streak > 0 ? "#F4C430" : "#8a8d93", // Yellow/Gold if active
            bgColor: "white",
            clickable: false,
        },
    ];

    return (
        <>
            <div className={styles.statsGrid}>
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className={`${styles.statCard} glass-panel ${stat.clickable ? styles.clickableCard : ''}`}
                            onClick={stat.clickable ? stat.onClick : undefined}
                            role={stat.clickable ? "button" : undefined}
                            tabIndex={stat.clickable ? 0 : undefined}
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.titleWrapper}>
                                    <span className={styles.iconCircle}>
                                        <Icon size={18} color={stat.iconColor} />
                                    </span>
                                    <h3 className={styles.title}>{stat.title}</h3>
                                </div>
                                <span className={styles.arrowIcon}>›</span>
                            </div>

                            <div className={styles.cardBody}>
                                <div className={styles.valueGroup}>
                                    <span className={styles.value}>{stat.value}</span>
                                    {stat.unit && <span className={styles.unit}>{stat.unit}</span>}
                                </div>
                                <span className={styles.subtitle}>{stat.subtitle}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Total Courses Modal */}
            {isTotalModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsTotalModalOpen(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Total Courses Enrolled</h2>
                            <button onClick={() => setIsTotalModalOpen(false)}><X size={20} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <form className={styles.addCourseForm} onSubmit={handleAddCourse}>
                                <input
                                    type="text"
                                    placeholder="Add a new enrolled course..."
                                    value={newCourseName}
                                    onChange={e => setNewCourseName(e.target.value)}
                                    disabled={isPending}
                                />
                                <button type="submit" disabled={!newCourseName.trim() || isPending}>
                                    <Plus size={16} /> Add
                                </button>
                            </form>

                            <div className={styles.courseList}>
                                {courses.length === 0 && <p className={styles.emptyText}>No courses enrolled yet.</p>}
                                {courses.map(course => (
                                    <div key={course.id} className={styles.courseItem}>
                                        <span className={`${styles.courseName} ${course.status === 'completed' ? styles.completedText : ''}`}>{course.name}</span>
                                        <div className={styles.courseActions}>
                                            {course.status === "active" ? (
                                                <button
                                                    className={styles.completeBtn}
                                                    title="Mark as Done"
                                                    onClick={(e) => handleMarkCompleted(course.id, e)}
                                                    disabled={isPending}
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                            ) : (
                                                <button
                                                    className={styles.undoBtn}
                                                    title="Mark as Active"
                                                    onClick={(e) => handleUnmarkCompleted(course.id, e)}
                                                    disabled={isPending}
                                                >
                                                    <Undo2 size={16} /> <span>Undo</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Completed Courses Modal */}
            {isCompletedModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsCompletedModalOpen(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Completed Courses</h2>
                            <button onClick={() => setIsCompletedModalOpen(false)}><X size={20} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.courseList}>
                                {completedCourses.length === 0 && <p className={styles.emptyText}>No completed courses yet. Keep going!</p>}
                                {completedCourses.map(course => (
                                    <div key={course.id} className={styles.courseItem}>
                                        <span className={styles.courseName}>{course.name}</span>
                                        <div className={styles.courseActions}>
                                            <button
                                                className={styles.deleteBtn}
                                                title="Delete Course"
                                                onClick={(e) => handleDeleteCourse(course.id, e)}
                                                disabled={isPending}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Challenges Modal */}
            {isChallengesModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsChallengesModalOpen(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Your Challenges</h2>
                            <button onClick={() => setIsChallengesModalOpen(false)}><X size={20} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.courseList}>
                                {totalChallengesCount === 0 && (
                                    <p className={styles.emptyText}>You are all caught up! No active challenges.</p>
                                )}

                                {challenges.events.map(event => (
                                    <div key={event.id} className={styles.challengeItem}>
                                        <div className={styles.challengeIcon} style={{ background: 'rgba(244, 196, 48, 0.1)', color: '#F4C430' }}>
                                            <Calendar size={18} />
                                        </div>
                                        <div className={styles.challengeInfo} style={{ flexGrow: 1 }}>
                                            <span className={styles.challengeTitle}>{event.title}</span>
                                            <span className={styles.challengeSubtitle}>
                                                {event.time ? `${event.time} • ` : ''}Upcoming {event.type}
                                            </span>
                                        </div>
                                        {event.link && (
                                            <a
                                                href={event.link.startsWith('http') ? event.link : `https://${event.link}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.joinBtnSmall}
                                            >
                                                Join
                                            </a>
                                        )}
                                    </div>
                                ))}

                                {challenges.tasks.map(task => (
                                    <div key={task.id} className={styles.challengeItem}>
                                        <div className={styles.challengeIcon} style={{ background: 'rgba(255, 173, 173, 0.1)', color: '#ffadad' }}>
                                            <ListTodo size={18} />
                                        </div>
                                        <div className={styles.challengeInfo}>
                                            <span className={styles.challengeTitle}>{task.title}</span>
                                            <span className={styles.challengeSubtitle}>To-do</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
