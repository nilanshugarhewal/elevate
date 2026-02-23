"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { startOfDay, endOfDay, subDays } from "date-fns";

export async function getUserHoursSpentMode() {
    const session = await auth();
    if (!session?.user?.id) return "manual";

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { hoursSpentMode: true },
        });
        return user?.hoursSpentMode || "manual";
    } catch (error) {
        console.error("Failed to fetch user mapping mode:", error);
        return "manual";
    }
}

export async function toggleHoursSpentMode(newMode: "manual" | "automatic") {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: { hoursSpentMode: newMode },
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to toggle mode:", error);
        return { error: "Failed to update study settings." };
    }
}

export async function addStudySession(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const subject = formData.get("subject") as string || "General";
    const durationStr = formData.get("durationHours") as string;
    const type = formData.get("type") as string || "study";
    const dateStr = formData.get("date") as string; // Optional custom date

    if (!durationStr || isNaN(parseFloat(durationStr))) {
        return { error: "Valid duration in hours is required." };
    }

    // Convert hours to minutes for the DB
    const durationMinutes = Math.round(parseFloat(durationStr) * 60);

    try {
        const sessionDate = dateStr ? new Date(dateStr) : new Date();

        await prisma.studySession.create({
            data: {
                subject,
                durationMinutes,
                type,
                date: sessionDate,
                userId: session.user.id,
            },
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to add study session:", error);
        return { error: "Failed to add study session." };
    }
}

export async function getWeeklyStudySessions() {
    const session = await auth();
    if (!session?.user?.id) return [];

    try {
        const sevenDaysAgo = startOfDay(subDays(new Date(), 6));
        const today = endOfDay(new Date());

        const rawSessions = await prisma.studySession.findMany({
            where: {
                userId: session.user.id,
                date: {
                    gte: sevenDaysAgo,
                    lte: today,
                }
            },
            orderBy: {
                date: "asc"
            }
        });

        return rawSessions;
    } catch (error) {
        console.error("Failed to fetch sessions", error);
        return [];
    }
}
