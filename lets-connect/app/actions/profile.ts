"use server";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma
const prisma = new PrismaClient();

export async function saveProfileDetails(
  userId: string, 
  data: { age: number; job: string; relationshipStatus: string }
) {
  try {
    // Update the user record using the ID provided by Neon Auth
    await prisma.user.update({
      where: { id: userId },
      data: {
        age: data.age,
        job: data.job,
        relationshipStatus: data.relationshipStatus, 
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Failed to save profile details to the database." };
  }
}