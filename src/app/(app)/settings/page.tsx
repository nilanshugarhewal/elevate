"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { Moon, Sun, LogOut, Info } from "lucide-react";
import styles from "./settings.module.scss";

export default function SettingsPage() {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    // Read initial theme
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme as "light" | "dark");
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/login" });
    };

    return (
        <div className={styles.settingsContainer}>
            <div className={styles.header}>
                <h1>Settings</h1>
                <p className={styles.subtitle}>Manage your preferences and account</p>
            </div>

            <div className={styles.contentGrid}>

                {/* Theme Preferences */}
                <section className={`${styles.settingSection} glass-panel`}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.iconCircle}><Sun size={20} /></span>
                        <h2>Appearance</h2>
                    </div>

                    <div className={styles.settingRow}>
                        <div className={styles.settingDetails}>
                            <h3>Dark Mode</h3>
                            <p>Toggle between light and dark themes</p>
                        </div>

                        <button
                            className={`${styles.toggleBtn} ${theme === 'dark' ? styles.active : ''}`}
                            onClick={toggleTheme}
                            aria-label="Toggle Dark Mode"
                        >
                            <div className={styles.toggleHandle}>
                                {theme === 'dark' ? <Moon size={14} color="#121212" /> : <Sun size={14} color="#F4C430" />}
                            </div>
                        </button>
                    </div>
                </section>

                {/* About App */}
                <section className={`${styles.settingSection} glass-panel`}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.iconCircle}><Info size={20} /></span>
                        <h2>About</h2>
                    </div>

                    <div className={styles.aboutContent}>
                        <h3>Student Dashboard v1.0</h3>
                        <p>
                            Designed to help students track their daily progress, focus on study sessions with Pomodoro timers, and keep ahead of their assignment schedules using calendar views.
                        </p>
                        <p className={styles.madeWith}>
                            Built with Next.js, SCSS, PostgreSQL, and Prisma. <br />
                            Features a sleek glassmorphism UI for premium user experience.
                        </p>
                    </div>
                </section>

                {/* Account / Logout */}
                <section className={`${styles.settingSection} glass-panel`}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.iconCircle} style={{ background: 'rgba(255, 173, 173, 0.2)', color: 'var(--accent-red)' }}><LogOut size={20} /></span>
                        <h2>Account</h2>
                    </div>

                    <div className={styles.settingRow}>
                        <div className={styles.settingDetails}>
                            <h3>Sign Out</h3>
                            <p>End your current session securely</p>
                        </div>

                        <button className={styles.logoutBtn} onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </section>

            </div>
        </div>
    );
}
