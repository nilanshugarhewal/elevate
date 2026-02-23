"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import styles from './HoursSpentChart.module.scss';
import { useState, useTransition, useMemo } from 'react';
import { Settings, X, Plus } from 'lucide-react';
import { addStudySession, toggleHoursSpentMode } from '@/app/actions/studySessionActions';
import { subDays, format, startOfDay } from 'date-fns';

type StudySession = {
    id: string;
    subject: string;
    durationMinutes: number;
    type: string;
    date: Date;
};

interface HoursSpentChartProps {
    sessions: StudySession[];
    initialMode: "manual" | "automatic";
}

export default function HoursSpentChart({ sessions, initialMode }: HoursSpentChartProps) {
    const [mode, setMode] = useState<"manual" | "automatic">(initialMode);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const [formData, setFormData] = useState({ subject: "", durationHours: "", type: "study", date: format(new Date(), "yyyy-MM-dd") });

    // Calculate data for the chart (last 7 days specifically)
    const chartData = useMemo(() => {
        const data = [];
        const today = startOfDay(new Date());

        for (let i = 6; i >= 0; i--) {
            const targetDate = subDays(today, i);
            const dateStr = format(targetDate, "yyyy-MM-dd");
            const dayName = format(targetDate, "EEE"); // Mon, Tue, etc.

            // Filter sessions for this specific day
            const daySessions = sessions.filter(
                (s) => format(new Date(s.date), "yyyy-MM-dd") === dateStr
            );

            // Sum durations in hours
            const studyMinutes = daySessions.filter(s => s.type === "study").reduce((sum, s) => sum + s.durationMinutes, 0);
            const examMinutes = daySessions.filter(s => s.type === "exam").reduce((sum, s) => sum + s.durationMinutes, 0);

            data.push({
                name: dayName,
                fullDate: dateStr,
                study: parseFloat((studyMinutes / 60).toFixed(1)),
                exam: parseFloat((examMinutes / 60).toFixed(1)),
            });
        }
        return data;
    }, [sessions]);

    // Generate strict array of last 7 valid configurable dates for the dropdown
    const validDates = useMemo(() => {
        const dates = [];
        const today = startOfDay(new Date());
        for (let i = 0; i < 7; i++) {
            const d = subDays(today, i);
            dates.push(format(d, "yyyy-MM-dd"));
        }
        return dates;
    }, []);

    const handleToggleMode = () => {
        const newMode = mode === "manual" ? "automatic" : "manual";
        setMode(newMode);
        startTransition(async () => {
            await toggleHoursSpentMode(newMode);
        });
    };

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.durationHours) return;

        startTransition(async () => {
            const data = new FormData();
            data.append("subject", formData.subject || "General");
            data.append("durationHours", formData.durationHours);
            data.append("type", formData.type);
            data.append("date", formData.date);

            await addStudySession(data);
            setIsAddModalOpen(false);
            setFormData({ subject: "", durationHours: "", type: "study", date: format(new Date(), "yyyy-MM-dd") });
        });
    };

    return (
        <div className={`${styles.chartWrapper} glass-panel`}>
            <div className={styles.chartHeader}>
                <div className={styles.titleGroup}>
                    <h2 className={styles.title}>Hours Spent</h2>
                    <div className={styles.legend}>
                        <span className={styles.legendItem}>
                            <span className={styles.dot} style={{ background: '#679267' }}></span> Study
                        </span>
                        <span className={styles.legendItem}>
                            <span className={styles.dot} style={{ background: 'var(--text-secondary)' }}></span> Exam
                        </span>
                    </div>
                </div>

                <div className={styles.headerControls}>
                    {mode === "manual" ? (
                        <button className={styles.iconBtn} onClick={() => setIsAddModalOpen(true)} title="Log Hours">
                            <Plus size={16} />
                        </button>
                    ) : (
                        <span className={styles.autoBadge}>Auto Tracked</span>
                    )}
                    <button className={styles.iconBtn} onClick={() => setIsSettingsOpen(true)} title="Tracking Settings">
                        <Settings size={16} />
                    </button>
                </div>
            </div>

            <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
                        barSize={32}
                    >
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                            tickFormatter={(value) => `${value} Hr`}
                            ticks={[0, 4, 8, 12, 16]}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                            contentStyle={{
                                borderRadius: '12px',
                                border: '1px solid var(--card-border)',
                                boxShadow: 'var(--card-shadow)',
                                background: 'var(--card-bg)',
                                color: 'var(--text-primary)'
                            }}
                        />
                        <Bar dataKey="study" stackId="a" fill="#679267" radius={[0, 0, 4, 4]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill="#679267" style={{ opacity: 0.9 }} />
                            ))}
                        </Bar>
                        <Bar dataKey="exam" stackId="a" fill="var(--text-secondary)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Tracking Settings Modal */}
            {isSettingsOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsSettingsOpen(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Tracking Settings</h2>
                            <button onClick={() => setIsSettingsOpen(false)}><X size={20} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <p className={styles.settingsDesc}>
                                Choose how you want to track your hours spent.
                            </p>

                            <div className={styles.toggleRow}>
                                <div>
                                    <h4>Manual Tracking</h4>
                                    <p>Log your study hours manually each day.</p>
                                </div>
                                <button
                                    className={`${styles.toggleBtn} ${mode === 'manual' ? styles.active : ''}`}
                                    onClick={() => mode !== 'manual' && handleToggleMode()}
                                    disabled={isPending}
                                >
                                    {mode === 'manual' ? 'Selected' : 'Select'}
                                </button>
                            </div>

                            <div className={styles.toggleRow}>
                                <div>
                                    <h4>Automatic Tracking</h4>
                                    <p>Hours are added automatically when using the Focus Timer.</p>
                                </div>
                                <button
                                    className={`${styles.toggleBtn} ${mode === 'automatic' ? styles.active : ''}`}
                                    onClick={() => mode !== 'automatic' && handleToggleMode()}
                                    disabled={isPending}
                                >
                                    {mode === 'automatic' ? 'Selected' : 'Select'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Manual Hours Modal */}
            {isAddModalOpen && mode === "manual" && (
                <div className={styles.modalOverlay} onClick={() => setIsAddModalOpen(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Log Study Hours</h2>
                            <button onClick={() => setIsAddModalOpen(false)}><X size={20} /></button>
                        </div>
                        <form className={styles.modalForm} onSubmit={handleAddSubmit}>
                            <div className={styles.inputGroup}>
                                <label>Date (Last 7 Days)</label>
                                <select
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    required
                                >
                                    {validDates.map(d => (
                                        <option key={d} value={d}>
                                            {d === validDates[0] ? "Today" : d === validDates[1] ? "Yesterday" : format(new Date(d), "MMM d, EEE")}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Duration (Hours)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0.1"
                                    max="24"
                                    placeholder="e.g. 2.5"
                                    value={formData.durationHours}
                                    onChange={e => setFormData({ ...formData, durationHours: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Category</label>
                                <select
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="study">Study</option>
                                    <option value="exam">Exam Prep</option>
                                </select>
                            </div>
                            <button type="submit" className={styles.submitBtn} disabled={isPending || !formData.durationHours}>
                                {isPending ? "Logging..." : "Log Hours"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
