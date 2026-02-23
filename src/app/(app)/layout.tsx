import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";
import styles from "./layout.module.scss";

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className={styles.appContainer}>
            <aside className={styles.sidebarWrapper}>
                <Sidebar user={session.user} />
            </aside>
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}
