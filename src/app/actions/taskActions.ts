"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Fetch all tasks for the logged in user
export async function getTasks() {
    const session = await auth();
    if (!session?.user?.id) return [];

    try {
        const tasks = await prisma.task.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: "desc", // Newest first
            },
        });
        return tasks;
    } catch (error) {
        console.error("Failed to fetch tasks:", error);
        return [];
    }
}

// Add a new task
export async function addTask(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const title = formData.get("title") as string;
    const subject = formData.get("subject") as string | null;
    const time = formData.get("time") as string | null;

    if (!title || title.trim() === "") {
        return { error: "Title is required" };
    }

    // We are storing time inside the dueDate for now or we can store it directly in subject if we want to combine them,
    // Let's keep it simple to match the styling
    let formattedSubject = subject;
    if (time && time.trim() !== "") {
        formattedSubject = subject ? `${subject} | ${time}` : time;
    }

    try {
        await prisma.task.create({
            data: {
                title: title.trim(),
                subject: formattedSubject,
                userId: session.user.id,
            },
        });

        // Revalidate multiple paths that show tasks
        revalidatePath("/dashboard");
        revalidatePath("/tasks");
        return { success: true };
    } catch (error) {
        console.error("Failed to add task:", error);
        return { error: "Failed to create task" };
    }
}

// Toggle task completion status
export async function toggleTask(taskId: string, isCompleted: boolean) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await prisma.task.update({
            where: {
                id: taskId,
                userId: session.user.id, // Ensure user owns the task
            },
            data: {
                isCompleted: !isCompleted,
            },
        });

        revalidatePath("/dashboard");
        revalidatePath("/tasks");
        return { success: true };
    } catch (error) {
        console.error("Failed to toggle task:", error);
        return { error: true };
    }
}

// Delete a task entirely
export async function deleteTask(taskId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await prisma.task.delete({
            where: {
                id: taskId,
                userId: session.user.id,
            },
        });

        revalidatePath("/dashboard");
        revalidatePath("/tasks");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete task:", error);
        return { error: true };
    }
}

// Delete all completed tasks (Reset feature)
export async function clearCompletedTasks() {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await prisma.task.deleteMany({
            where: {
                userId: session.user.id,
                isCompleted: true,
            },
        });

        revalidatePath("/dashboard");
        revalidatePath("/tasks");
        return { success: true };
    } catch (error) {
        console.error("Failed to clear completed tasks:", error);
        return { error: true };
    }
}
