"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getCourses() {
    const session = await auth();
    if (!session?.user?.id) return [];

    try {
        const courses = await prisma.course.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return courses;
    } catch (error) {
        console.error("Failed to fetch courses:", error);
        return [];
    }
}

export async function addCourse(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const name = formData.get("name") as string;
    if (!name || name.trim() === "") {
        return { error: "Course name is required" };
    }

    try {
        await prisma.course.create({
            data: {
                name: name.trim(),
                status: "active",
                userId: session.user.id,
            },
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to add course:", error);
        return { error: "Failed to create course" };
    }
}

export async function markCourseCompleted(courseId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await prisma.course.update({
            where: {
                id: courseId,
                userId: session.user.id,
            },
            data: {
                status: "completed",
            },
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to mark course completed:", error);
        return { error: true };
    }
}

export async function unmarkCourseCompleted(courseId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await prisma.course.update({
            where: {
                id: courseId,
                userId: session.user.id,
            },
            data: {
                status: "active",
            },
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to unmark course completed:", error);
        return { error: true };
    }
}

export async function deleteCourse(courseId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await prisma.course.delete({
            where: {
                id: courseId,
                userId: session.user.id,
            },
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete course:", error);
        return { error: true };
    }
}
