"use client";

import { useState } from "react";
import { Edit3, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, subDays, startOfWeek, isSameDay } from "date-fns";
import { updateProfile } from "@/app/actions/profileActions";
import styles from "./ProfileSidebar.module.scss";

interface ProfileProps {
    user: { name?: string | null; image?: string | null; collegeName?: string | null };
}

export default function ProfileSidebar({ user }: ProfileProps) {
    // Edit state
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || "");
    const [college, setCollege] = useState(user?.collegeName || "");
    const [isPending, setIsPending] = useState(false);

    // Derived values mapping
    const displayName = name || "Student User";
    const displayCollege = college || "Your College Name";
    const initials = displayName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

    // Calendar state (rolling 7-day view)
    const [currentDate, setCurrentDate] = useState(new Date());

    const nextWeek = () => setCurrentDate(addDays(currentDate, 7));
    const prevWeek = () => setCurrentDate(subDays(currentDate, 7));

    const handleSave = async () => {
        setIsPending(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("collegeName", college);

        const result = await updateProfile(formData);
        if (result.success) {
            setIsEditing(false);
        } else {
            // Revert on failure
            setName(user?.name || "");
            setCollege(user?.collegeName || "");
            alert("Failed to update profile");
        }
        setIsPending(false);
    };

    const handleCancel = () => {
        setName(user?.name || "");
        setCollege(user?.collegeName || "");
        setIsEditing(false);
    };

    // Calendar rendering logic
    const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 }); // Starts on Monday
    const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const weekDates = Array.from({ length: 7 }).map((_, i) => addDays(startOfCurrentWeek, i));

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h3 className={styles.title}>Profile</h3>
                {!isEditing && (
                    <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
                        <Edit3 size={16} />
                    </button>
                )}
            </div>

            <div className={styles.profileInfo}>
                <div className={styles.avatar}>
                    {user?.image ? (
                        <img src={user.image} alt={displayName} />
                    ) : (
                        <span>{initials}</span>
                    )}
                </div>

                {isEditing ? (
                    <div className={styles.editForm}>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={styles.editInput}
                            placeholder="Your Name"
                            disabled={isPending}
                        />
                        <input
                            type="text"
                            value={college}
                            onChange={(e) => setCollege(e.target.value)}
                            className={styles.editInput}
                            placeholder="College Name"
                            disabled={isPending}
                        />
                        <div className={styles.editActions}>
                            <button className={styles.saveBtn} onClick={handleSave} disabled={isPending || !name.trim()}>
                                <Check size={16} /> Save
                            </button>
                            <button className={styles.cancelBtn} onClick={handleCancel} disabled={isPending}>
                                <X size={16} /> Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 className={styles.name}>{displayName}</h2>
                        <p className={styles.college}>{displayCollege}</p>
                    </>
                )}
            </div>

            <div className={`${styles.calendarWidget} glass-panel`}>
                <div className={styles.calHeader}>
                    <button onClick={prevWeek}><ChevronLeft size={16} /></button>
                    <span>{format(currentDate, "MMMM yyyy")}</span>
                    <button onClick={nextWeek}><ChevronRight size={16} /></button>
                </div>

                <div className={styles.calGrid}>
                    {weekDays.map((day, i) => (
                        <div key={`day-${i}`} className={styles.dayName}>{day}</div>
                    ))}
                    {weekDates.map((date, i) => {
                        const isToday = isSameDay(date, new Date());
                        // Just checking if date is today to mark it active for now 
                        return (
                            <div
                                key={`date-${i}`}
                                className={`${styles.dateCell} ${isToday ? styles.active : ''}`}
                            >
                                {format(date, "d")}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
