"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { differenceInCalendarDays, startOfDay } from "date-fns";

export async function manageDailyStreak() {
    const session = await auth();
    if (!session?.user?.id) return { currentStreak: 0 };

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { currentStreak: true, lastLoginDate: true }
        });

        if (!user) return { currentStreak: 0 };

        const now = new Date();
        const today = startOfDay(now);

        let newStreak = user.currentStreak;
        let shouldUpdateDB = false;

        if (!user.lastLoginDate) {
            // First time logging in or first time since feature was added
            newStreak = 1;
            shouldUpdateDB = true;
        } else {
            const lastLogin = startOfDay(user.lastLoginDate);
            const diffDays = differenceInCalendarDays(today, lastLogin);

            if (diffDays === 1) {
                // Logged in exactly yesterday: increment streak
                newStreak += 1;
                shouldUpdateDB = true;
            } else if (diffDays > 1) {
                // Skipped a day or more: reset streak
                newStreak = 1;
                shouldUpdateDB = true;
            }
            // If diffDays === 0, they already logged in today, do nothing.
        }

        if (shouldUpdateDB) {
            await prisma.user.update({
                where: { id: session.user.id },
                data: {
                    currentStreak: newStreak,
                    lastLoginDate: now,
                }
            });
        }

        return { currentStreak: newStreak };

    } catch (error) {
        console.error("Failed to manage streak:", error);
        // Graceful fallback to return the streak as it was, or 0 if it failed hard
        return { currentStreak: 0 };
    }
}

// Triggering TS Recompile
