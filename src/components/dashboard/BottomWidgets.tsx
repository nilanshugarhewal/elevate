import { Smile, Frown, Meh, Angry } from "lucide-react";
import LiveClassWidget from "./LiveClassWidget";
import ExamWidget from "./ExamWidget";
import styles from "./BottomWidgets.module.scss";

type Event = {
    id: string;
    title: string;
    date: Date;
    courseName?: string | null;
    time?: string | null;
    link?: string | null;
    type: string;
};

interface BottomWidgetsProps {
    events?: Event[];
}

export default function BottomWidgets({ events = [] }: BottomWidgetsProps) {
    return (
        <div className={styles.bottomGrid}>

            {/* Live Class Widget */}
            <LiveClassWidget events={events} />

            {/* Exam Schedule Widget */}
            <ExamWidget events={events} />

            {/* Mood Tracker Widget */}
            <div className={`${styles.widgetCard} glass-panel ${styles.moodWidget}`}>
                <h3>Mode now</h3>
                <div className={styles.moodList}>
                    <button className={styles.moodBtn} title="Happy"><Smile size={28} color="#F4C430" /></button>
                    <button className={styles.moodBtn} title="Neutral"><Meh size={28} color="#a3c4f3" /></button>
                    <button className={styles.moodBtn} title="Focused"><Meh size={28} color="#679267" /></button>
                    <button className={styles.moodBtn} title="Tired"><Frown size={28} color="#ffadad" /></button>
                    <button className={styles.moodBtn} title="Angry"><Angry size={28} color="#ffadad" /></button>
                </div>
            </div>

        </div>
    );
}
