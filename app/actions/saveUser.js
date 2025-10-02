"use server"
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const saveUserToDb = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await prisma?.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${user.firstName} ${user.lastName}`;
    const newUsername= name.split(" ").join("_") + user.id.slice(-4);
     const client = await clerkClient();

    client.users.updateUser(user.id,{
      username:newUsername
    });
    
    const newUser = await prisma.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
        username: name.split(" ").join("_") + user.id.slice(-4),
      },
    });

    return newUser;
    
  } catch (error) {
    console.log(error);
  }
};
