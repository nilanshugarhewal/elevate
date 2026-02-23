"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function updateProfile(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const name = formData.get("name") as string;
    const collegeName = formData.get("collegeName") as string;

    if (!name || name.trim() === "") {
        return { error: "Name is required" };
    }

    try {
        await prisma.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                name: name.trim(),
                collegeName: collegeName ? collegeName.trim() : null,
            },
        });

        // Revalidate paths to update the UI
        revalidatePath("/dashboard");
        revalidatePath("/tasks");
        revalidatePath("/calendar");
        revalidatePath("/settings");

        return { success: true };
    } catch (error) {
        console.error("Failed to update profile:", error);
        return { error: "Failed to update profile" };
    }
}
