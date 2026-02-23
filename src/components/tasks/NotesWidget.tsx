"use client";

import { useState } from "react";
import { Save, Copy, Check } from "lucide-react";
import styles from "./NotesWidget.module.scss";

export default function NotesWidget() {
    const [note, setNote] = useState("");
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!note) return;
        navigator.clipboard.writeText(note);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSave = () => {
        if (!note) return;
        const confirmDownload = window.confirm("Do you want to download the notes file?");
        if (confirmDownload) {
            const blob = new Blob([note], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "quick_notes.txt";
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    return (
        <div className={`${styles.wrapper} glass-panel`}>
            <div className={styles.header}>
                <h3 className={styles.title}>Quick Notes</h3>
                <div className={styles.actions}>
                    <button className={styles.copyBtn} onClick={handleCopy} title="Copy Notes">
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? "Copied!" : "Copy"}
                    </button>
                    <button className={styles.saveBtn} onClick={handleSave} title="Save Notes">
                        <Save size={16} /> Save
                    </button>
                </div>
            </div>

            <textarea
                className={styles.textArea}
                placeholder="Type your study notes here..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
            ></textarea>
        </div>
    );
}
