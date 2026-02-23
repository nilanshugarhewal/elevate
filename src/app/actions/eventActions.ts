"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function addEvent(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const title = formData.get("title") as string;
    const courseName = formData.get("courseName") as string;
    const time = formData.get("time") as string;
    const link = formData.get("link") as string;
    const type = formData.get("type") as string || "class";
    const dateStr = formData.get("date") as string;

    if (!title) {
        return { error: "Title is required." };
    }

    try {
        const eventDate = dateStr ? new Date(dateStr) : new Date();

        await prisma.event.create({
            data: {
                title,
                courseName: courseName || null,
                time,
                link,
                date: eventDate,
                type,
                userId: session.user.id,
            },
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to add event:", error);
        return { error: "Failed to add live class" };
    }
}

export async function deleteEvent(eventId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await prisma.event.delete({
            where: {
                id: eventId,
                userId: session.user.id,
            },
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete event:", error);
        return { error: "Failed to delete" };
    }
}
