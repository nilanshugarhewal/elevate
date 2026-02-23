"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getAllCalendarData() {
    const session = await auth();
    if (!session?.user?.id) return { tasks: [], events: [] };

    try {
        // Fetch all tasks for the user
        const tasks = await prisma.task.findMany({
            where: {
                userId: session.user.id,
            },
            select: {
                id: true,
                title: true,
                createdAt: true,
                dueDate: true,
                isCompleted: true,
            },
        });

        // Fetch all events (Live Classes & Exams) for the user
        const events = await prisma.event.findMany({
            where: {
                userId: session.user.id,
            },
            select: {
                id: true,
                title: true,
                date: true,
                type: true,
            },
        });

        return { tasks, events };
    } catch (error) {
        console.error("Failed to fetch calendar data:", error);
        return { tasks: [], events: [] };
    }
}
