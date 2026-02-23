"use client";

import { useState, useTransition } from "react";
import { Plus, X, ChevronLeft, ChevronRight, Video, Trash2 } from "lucide-react";
import { addEvent, deleteEvent } from "@/app/actions/eventActions";
import styles from "./LiveClassWidget.module.scss";

type Event = {
    id: string;
    title: string;
    date: Date;
    courseName?: string | null;
    time?: string | null;
    link?: string | null;
    type: string;
};

interface LiveClassWidgetProps {
    events: Event[];
}

export default function LiveClassWidget({ events }: LiveClassWidgetProps) {
    const liveClasses = events.filter(e => e.type === "class").slice(0, 3);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPending, startTransition] = useTransition();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: "", courseName: "", startTime: "", endTime: "", link: "" });

    const handleNext = () => {
        if (liveClasses.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % liveClasses.length);
    };

    const handlePrev = () => {
        if (liveClasses.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + liveClasses.length) % liveClasses.length);
    };

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
        if (!formData.title || !formData.courseName) return;

        startTransition(async () => {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("courseName", formData.courseName);
            data.append("link", formData.link);

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
            setFormData({ title: "", courseName: "", startTime: "", endTime: "", link: "" });
            // Default to the newly added class visually (which appears at the end)
            setCurrentIndex(liveClasses.length < 3 ? liveClasses.length : 2);
        });
    };

    const handleDelete = (id: string) => {
        startTransition(async () => {
            await deleteEvent(id);
            if (currentIndex >= liveClasses.length - 1) {
                setCurrentIndex(Math.max(0, liveClasses.length - 2));
            }
        });
    };

    const safeIndex = liveClasses.length > 0 ? Math.min(currentIndex, liveClasses.length - 1) : 0;
    const currentClass = liveClasses[safeIndex];

    // Safety check just in case liveClasses is empty
    if (liveClasses.length === 0) {
        return (
            <div className={`${styles.widgetCard} glass-panel`}>
                <div className={styles.header}>
                    <div className={styles.titleWrapper}>
                        <h3>Live class</h3>
                    </div>
                </div>
                <div className={styles.emptyState}>
                    <div className={styles.placeholderImg}>
                        <Video size={32} color="var(--text-secondary)" />
                    </div>
                    <p>No upcoming live classes.</p>
                    <button className={styles.actionBtnDark} onClick={() => setIsAddModalOpen(true)}>
                        Schedule a Class
                    </button>
                </div>
                {/* Add Class Modal placed here too for empty state edge cases */}
                {isAddModalOpen && (
                    <div className={styles.modalOverlay} onClick={() => setIsAddModalOpen(false)}>
                        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <h2>Add Live Class</h2>
                                <button onClick={() => setIsAddModalOpen(false)}><X size={20} /></button>
                            </div>
                            <form className={styles.modalForm} onSubmit={handleAddSubmit}>
                                <div className={styles.inputGroup}>
                                    <label>Class Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Higher Math part -2 solution"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Course Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. SSC 2025 English Revision"
                                        value={formData.courseName}
                                        onChange={e => setFormData({ ...formData, courseName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Timing</label>
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
                                <div className={styles.inputGroup}>
                                    <label>Meeting Link</label>
                                    <input
                                        type="url"
                                        placeholder="e.g. https://meet.google.com/xyz"
                                        value={formData.link}
                                        onChange={e => setFormData({ ...formData, link: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className={styles.submitBtn} disabled={isPending || !formData.title || !formData.courseName}>
                                    {isPending ? "Adding..." : "Add Class"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`${styles.widgetCard} glass-panel`}>
            <div className={styles.header}>
                <div className={styles.titleWrapper}>
                    <h3>Live class</h3>
                    {liveClasses.length > 0 && liveClasses.length < 3 && (
                        <span className={styles.countBadge}>{liveClasses.length}/3</span>
                    )}
                </div>

                {liveClasses.length < 3 ? (
                    <button className={styles.iconBtn} onClick={() => setIsAddModalOpen(true)} title="Add Live Class">
                        <Plus size={18} />
                    </button>
                ) : (
                    <span className={styles.limitText}>Max 3</span>
                )}
            </div>

            <>
                <div className={styles.navigationRow}>
                    {currentClass.time && (
                        <span className={styles.timeTag}>
                            <span className={styles.liveIndicator}></span> {currentClass.time}
                        </span>
                    )}

                    {liveClasses.length > 1 && (
                        <div className={styles.carouselNav}>
                            <button onClick={handlePrev}><ChevronLeft size={16} /></button>
                            <span>{currentIndex + 1} / {liveClasses.length}</span>
                            <button onClick={handleNext}><ChevronRight size={16} /></button>
                        </div>
                    )}
                </div>

                <div className={styles.classInfo}>
                    <div className={styles.titleRow}>
                        <p className={styles.classTitle}>{currentClass.title}</p>
                        <button className={styles.deleteBtn} onClick={() => handleDelete(currentClass.id)} disabled={isPending}>
                            <Trash2 size={16} />
                        </button>
                    </div>
                    {currentClass.courseName && <p className={styles.courseName}>Course: {currentClass.courseName}</p>}
                    {currentClass.link && (
                        <p className={styles.classLink}>
                            Link: <a href={currentClass.link.startsWith('http') ? currentClass.link : `https://${currentClass.link}`} target="_blank" rel="noopener noreferrer">{currentClass.link}</a>
                        </p>
                    )}
                </div>

                {currentClass.link ? (
                    <a
                        href={currentClass.link.startsWith('http') ? currentClass.link : `https://${currentClass.link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.actionBtnContainer}
                    >
                        <button className={styles.actionBtn}>Join The Class</button>
                    </a>
                ) : (
                    <button className={styles.actionBtn} disabled>No Link Available</button>
                )}
            </>

            {/* Add Class Modal */}
            {isAddModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsAddModalOpen(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Add Live Class</h2>
                            <button onClick={() => setIsAddModalOpen(false)}><X size={20} /></button>
                        </div>
                        <form className={styles.modalForm} onSubmit={handleAddSubmit}>
                            <div className={styles.inputGroup}>
                                <label>Class Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Higher Math part -2 solution"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Course Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. SSC 2025 English Revision"
                                    value={formData.courseName}
                                    onChange={e => setFormData({ ...formData, courseName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Timing</label>
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
                            <div className={styles.inputGroup}>
                                <label>Meeting Link</label>
                                <input
                                    type="url"
                                    placeholder="e.g. https://meet.google.com/xyz"
                                    value={formData.link}
                                    onChange={e => setFormData({ ...formData, link: e.target.value })}
                                />
                            </div>
                            <button type="submit" className={styles.submitBtn} disabled={isPending || !formData.title || !formData.courseName}>
                                {isPending ? "Adding..." : "Add Class"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
