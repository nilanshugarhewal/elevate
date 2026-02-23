"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getChallenges() {
    const session = await auth();
    if (!session?.user?.id) return { tasks: [], events: [] };

    try {
        const now = new Date();

        // Get incomplete tasks
        const tasks = await prisma.task.findMany({
            where: {
                userId: session.user.id,
                isCompleted: false,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // Get upcoming events (classes/exams) from today onwards
        const events = await prisma.event.findMany({
            where: {
                userId: session.user.id,
                date: {
                    gte: new Date(now.setHours(0, 0, 0, 0)),
                },
            },
            orderBy: {
                date: "asc",
            },
        });

        return { tasks, events };
    } catch (error) {
        console.error("Failed to fetch challenges:", error);
        return { tasks: [], events: [] };
    }
}
