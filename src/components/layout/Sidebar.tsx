"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    CheckSquare,
    CalendarDays,
    Settings,
    LogOut,
    Dumbbell
} from "lucide-react";
import styles from "./Sidebar.module.scss";

interface SidebarProps {
    user: { name?: string | null; email?: string | null; id?: string };
}

export default function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname();

    const navItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Tasks & Focus", href: "/tasks", icon: CheckSquare },
        { name: "Calendar", href: "/calendar", icon: CalendarDays },
    ];

    const bottomItems = [
        { name: "Settings", href: "/settings", icon: Settings },
    ];

    return (
        <nav className={styles.sidebar}>
            <div className={styles.logoArea}>
                <div className={styles.logoIcon}>
                    <Dumbbell size={24} color="#f5f6fa" />
                </div>
            </div>

            <div className={styles.navSection}>
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    const Icon = item.icon;

                    return (
                        <Link
                            href={item.href}
                            key={item.href}
                            className={`${styles.navItem} ${isActive ? styles.active : ""}`}
                            title={item.name}
                        >
                            <span className={styles.iconWrapper}>
                                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            </span>
                        </Link>
                    );
                })}
            </div>

            <div className={styles.bottomSection}>
                {bottomItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            href={item.href}
                            key={item.href}
                            className={`${styles.navItem} ${isActive ? styles.active : ""}`}
                            title={item.name}
                        >
                            <span className={styles.iconWrapper}>
                                <Icon size={22} />
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
