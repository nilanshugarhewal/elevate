"use client";

import { useState, useTransition } from "react";
import { Plus, X, Calendar as CalendarIcon, Trash2, Clock } from "lucide-react";
import { addEvent, deleteEvent } from "@/app/actions/eventActions";
import styles from "./ExamWidget.module.scss";

type Event = {
    id: string;
    title: string;
    date: Date;
    courseName?: string | null;
    time?: string | null;
    type: string;
};

interface ExamWidgetProps {
    events: Event[];
}

export default function ExamWidget({ events }: ExamWidgetProps) {
    // Filter exams and sort by date ascending
    const exams = events
        .filter(e => e.type === "exam")
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 4); // Show up to 4 upcoming exams

    const [isPending, startTransition] = useTransition();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: "", courseName: "", date: "", startTime: "", endTime: "" });

    // Helper to convert 24h to 12h for display
    const formatTime12h = (time24: string) => {
        if (!time24) return "";
        const [hours, minutes] = time24.split(':');
        let h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'pm' : 'am';
        h = h % 12;
        h = h ? h : 12; // 0 should be 12
        return `${h.toString().padStart(2, '0')}:${minutes}${ampm}`;
    };

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.date) return;

        startTransition(async () => {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("courseName", formData.courseName);
            data.append("date", formData.date); // YYYY-MM-DD
            data.append("type", "exam");

            let timeString = "";
            if (formData.startTime) {
                timeString = formatTime12h(formData.startTime);
                if (formData.endTime) {
                    timeString += ` - ${formatTime12h(formData.endTime)}`;
                }
            }
            data.append("time", timeString);

            await addEvent(data);
            setIsAddModalOpen(false);
            setFormData({ title: "", courseName: "", date: "", startTime: "", endTime: "" });
        });
    };

    const handleDelete = (id: string) => {
        startTransition(async () => {
            await deleteEvent(id);
        });
    };

    return (
        <div className={`${styles.widgetCard} glass-panel`}>
            <div className={styles.header}>
                <div className={styles.titleWrapper}>
                    <h3>Exam schedule</h3>
                    {exams.length > 0 && (
                        <span className={styles.countBadge}>{exams.length} Upcoming</span>
                    )}
                </div>
                <button className={styles.iconBtn} onClick={() => setIsAddModalOpen(true)} title="Add Exam">
                    <Plus size={18} />
                </button>
            </div>

            <div className={styles.scheduleContent}>
                {exams.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.placeholderImg}>
                            <CalendarIcon size={32} color="var(--text-secondary)" />
                        </div>
                        <p>No exams scheduled.</p>
                    </div>
                ) : (
                    <div className={styles.examList}>
                        {exams.map(exam => (
                            <div key={exam.id} className={styles.examItem}>
                                <div className={styles.dateBox}>
                                    <span className={styles.month}>{new Date(exam.date).toLocaleString('default', { month: 'short' })}</span>
                                    <span className={styles.day}>{new Date(exam.date).getDate()}</span>
                                </div>
                                <div className={styles.examInfo}>
                                    <p className={styles.examTitle}>{exam.title}</p>
                                    {exam.courseName && <p className={styles.courseName}>{exam.courseName}</p>}
                                    {exam.time && (
                                        <div className={styles.timeRow}>
                                            <Clock size={12} />
                                            <span>{exam.time}</span>
                                        </div>
                                    )}
                                </div>
                                <button className={styles.deleteBtn} onClick={() => handleDelete(exam.id)} disabled={isPending}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button className={styles.actionBtnDark} onClick={() => setIsAddModalOpen(true)}>
                Plan Your Exams
            </button>

            {/* Add Exam Modal */}
            {isAddModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsAddModalOpen(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Schedule Exam</h2>
                            <button onClick={() => setIsAddModalOpen(false)}><X size={20} /></button>
                        </div>
                        <form className={styles.modalForm} onSubmit={handleAddSubmit}>
                            <div className={styles.inputGroup}>
                                <label>Exam Title *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Final Math Exam"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Course Name (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. MAT 101"
                                    value={formData.courseName}
                                    onChange={e => setFormData({ ...formData, courseName: e.target.value })}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Exam Date *</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Timing (Optional)</label>
                                <div className={styles.timeInputsRow}>
                                    <input
                                        type="time"
                                        value={formData.startTime}
                                        onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                                    />
                                    <span>to</span>
                                    <input
                                        type="time"
                                        value={formData.endTime}
                                        onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button type="submit" className={styles.submitBtn} disabled={isPending || !formData.title || !formData.date}>
                                {isPending ? "Scheduling..." : "Schedule Exam"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
