"use client";

import { useState, useTransition, useEffect } from "react";
import { Plus, Check, Circle, Trash2, X } from "lucide-react";
import { toggleTask, deleteTask, addTask } from "@/app/actions/taskActions";
import styles from "./TodoList.module.scss";

type Task = {
    id: string;
    title: string;
    subject: string | null;
    isCompleted: boolean;
};

export default function TodoListClient({ initialTasks }: { initialTasks: Task[] }) {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    // UI state for adding a new task
    const [isAdding, setIsAdding] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskSubject, setNewTaskSubject] = useState("");
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        setTasks(initialTasks);
    }, [initialTasks]);

    const handleToggle = (id: string, currentStatus: boolean) => {
        // Optimistic UI update
        const updatedTasks = tasks.map(t =>
            t.id === id ? { ...t, isCompleted: !currentStatus } : t
        );
        setTasks(updatedTasks);

        startTransition(async () => {
            const result = await toggleTask(id, currentStatus);
            if (result.error) {
                // Revert on error
                setTasks(initialTasks);
            }
        });
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        // Optimistic UI update
        setTasks(tasks.filter(t => t.id !== id));

        startTransition(async () => {
            const result = await deleteTask(id);
            if (result.error) {
                // Revert
                setTasks(initialTasks);
            }
        });
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        const fakeId = `temp-${Date.now()}`;
        const newTask: Task = {
            id: fakeId,
            title: newTaskTitle.trim(),
            subject: newTaskSubject.trim() || null,
            isCompleted: false
        };

        // Optimistic UI update
        setTasks([newTask, ...tasks]);
        setIsAdding(false);
        setNewTaskTitle("");
        setNewTaskSubject("");

        startTransition(async () => {
            const formData = new FormData();
            formData.append("title", newTask.title);
            if (newTask.subject) formData.append("subject", newTask.subject);

            const result = await addTask(formData);
            if (result.error) {
                // Remove the fake item on failure
                setTasks(tasks => tasks.filter(t => t.id !== fakeId));
            } else {
                // Trigger a hard reload of data to get real IDs, or let revalidatePath handle it if listening to server state changes correctly in Next.js
                // In modern Next.js with app router, revalidatePath will refresh the server component wrapper which then passes new props here.
                // We will update the state with the real data once the component re-renders from the server.
            }
        });
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h3 className={styles.title}>Todo list</h3>
                <button
                    className={styles.addBtn}
                    onClick={() => setIsAdding(!isAdding)}
                    disabled={isPending}
                >
                    {isAdding ? <X size={16} /> : <Plus size={16} />}
                    {isAdding ? 'Cancel' : 'Add Todo'}
                </button>
            </div>

            {isAdding && (
                <form className={styles.addForm} onSubmit={handleAdd}>
                    <input
                        type="text"
                        placeholder="What do you need to do?"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        autoFocus
                        required
                        className={styles.inputField}
                    />
                    <input
                        type="text"
                        placeholder="Subject / Time (Optional)"
                        value={newTaskSubject}
                        onChange={(e) => setNewTaskSubject(e.target.value)}
                        className={styles.inputField}
                    />
                    <button type="submit" className={styles.submitBtn} disabled={!newTaskTitle.trim() || isPending}>
                        Save Task
                    </button>
                </form>
            )}

            <div className={styles.list}>
                {tasks.length === 0 && !isAdding && (
                    <p className={styles.emptyState}>No tasks yet. Enjoy your day!</p>
                )}
                {tasks.map(todo => (
                    <div key={todo.id} className={`${styles.todoItem} ${todo.isCompleted ? styles.completed : ''}`}>
                        <button className={styles.checkBtn} onClick={() => handleToggle(todo.id, todo.isCompleted)}>
                            {todo.isCompleted ? (
                                <Check size={16} strokeWidth={3} color="white" className={styles.checkIcon} />
                            ) : (
                                <Circle size={18} color="var(--text-secondary)" />
                            )}
                        </button>
                        <div className={styles.content}>
                            <p className={styles.todoTitle}>{todo.title}</p>
                            {todo.subject && (
                                <p className={styles.meta}>
                                    {todo.subject}
                                </p>
                            )}
                        </div>
                        <button className={styles.deleteBtn} onClick={(e) => handleDelete(todo.id, e)} title="Delete Task">
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
