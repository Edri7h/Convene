"use server";


import { prisma } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function updateUsername(username) {

  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Check if username is already taken
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser && existingUser.id !== userId) {
    throw new Error("Username is already taken");
  }

  // Update username in database
  await prisma.user.update({
    where: { clerkUserId: userId },
    data: { username },
  });

  // Update username in Clerk
  await clerkClient.users.updateUser(userId, {
    username,
  });

  return { success: true };
  
}



// get user 



// import { prisma } from "@/lib/prisma";

export async function getUserProfile(username) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      name: true,
      imageUrl: true,
      email: true,
      createdAt: true,
      events: {
        where: { isPrivate: false },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          duration: true,
          createdAt: true,
        }
      },
      _count: {
        select: {
          events: { where: { isPrivate: false } },
          bookings: true
        }
      }
    },
  });

  return user;
}
