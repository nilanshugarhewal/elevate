"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Settings2 } from "lucide-react";
import styles from "./FocusTimer.module.scss";

export default function FocusTimer() {
    const [studyDuration, setStudyDuration] = useState(25); // minutes
    const [breakDuration, setBreakDuration] = useState(5); // minutes
    const [cycles, setCycles] = useState(4);

    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<"study" | "break">("study");
    const [currentCycle, setCurrentCycle] = useState(1);

    const [showSettings, setShowSettings] = useState(false);

    // When settings change, adjust the timer if it's not currently running
    useEffect(() => {
        if (!isActive) {
            if (mode === "study") {
                setTimeLeft(studyDuration * 60);
            } else {
                setTimeLeft(breakDuration * 60);
            }
        }
    }, [studyDuration, breakDuration, cycles, isActive, mode]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => time - 1);
            }, 1000);
        } else if (isActive && timeLeft === 0) {
            if (mode === "study") {
                if (currentCycle < cycles) {
                    // Time for a break
                    setMode("break");
                    setTimeLeft(breakDuration * 60);
                } else {
                    // Finished all cycles
                    setIsActive(false);
                    setMode("study");
                    setCurrentCycle(1);
                    setTimeLeft(studyDuration * 60);
                }
            } else {
                // Break is over, back to studying
                setMode("study");
                setCurrentCycle((c) => c + 1);
                setTimeLeft(studyDuration * 60);
            }
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode, currentCycle, cycles, studyDuration, breakDuration]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setMode("study");
        setCurrentCycle(1);
        setTimeLeft(studyDuration * 60);
    };

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const totalTimeForCurrentMode = (mode === "study" ? studyDuration : breakDuration) * 60;
    // Prevent division by zero if duration happens to be set to 0 initially due to rapid typing
    const safeTotalTime = totalTimeForCurrentMode > 0 ? totalTimeForCurrentMode : 1;
    const progress = ((safeTotalTime - timeLeft) / safeTotalTime) * 100;

    return (
        <div className={`${styles.wrapper} glass-panel`}>
            <div className={styles.header}>
                <h3 className={styles.title}>Focus Timer</h3>
                <button
                    className={styles.settingsBtn}
                    onClick={() => setShowSettings(!showSettings)}
                    title="Timer Settings"
                >
                    <Settings2 size={20} />
                </button>
            </div>

            {showSettings ? (
                <div className={styles.settingsPanel}>
                    <div className={styles.settingGroup}>
                        <label>Focus Time (min)</label>
                        <input
                            type="number"
                            min="1"
                            value={studyDuration}
                            onChange={(e) => setStudyDuration(Math.max(1, Number(e.target.value)))}
                        />
                    </div>
                    <div className={styles.settingGroup}>
                        <label>Break Time (min)</label>
                        <input
                            type="number"
                            min="1"
                            value={breakDuration}
                            onChange={(e) => setBreakDuration(Math.max(1, Number(e.target.value)))}
                        />
                    </div>
                    <div className={styles.settingGroup}>
                        <label>Number of Cycles</label>
                        <input
                            type="number"
                            min="1"
                            value={cycles}
                            onChange={(e) => setCycles(Math.max(1, Number(e.target.value)))}
                        />
                    </div>
                    <button className={styles.saveBtn} onClick={() => setShowSettings(false)}>
                        Done
                    </button>
                </div>
            ) : (
                <>
                    <div className={styles.statusInfo}>
                        <span className={mode === "study" ? styles.modeStudy : styles.modeBreak}>
                            {mode === "study" ? "Focusing" : "Break Time"}
                        </span>
                        <span className={styles.cycleInfo}>
                            Cycle {currentCycle} of {cycles}
                        </span>
                    </div>

                    <div className={styles.timerCircle}>
                        <svg className={styles.progressRing} viewBox="0 0 100 100">
                            <circle className={styles.ringTrack} cx="50" cy="50" r="45" />
                            <circle
                                className={`${styles.ringFill} ${mode === "break" ? styles.ringBreak : ""}`}
                                cx="50" cy="50" r="45"
                                strokeDasharray={283}
                                strokeDashoffset={283 - (283 * progress) / 100}
                            />
                        </svg>
                        <div className={styles.timeDisplay}>
                            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                        </div>
                    </div>

                    <div className={styles.controls}>
                        <button
                            className={`${styles.controlBtn} ${mode === "break" ? styles.btnBreak : ""}`}
                            onClick={toggleTimer}
                        >
                            {isActive ? <Pause size={24} /> : <Play size={24} />}
                        </button>
                        <button className={styles.controlBtnSecondary} onClick={resetTimer} title="Reset Timer">
                            <RotateCcw size={20} />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
