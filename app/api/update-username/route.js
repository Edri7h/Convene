// app/api/update-username/route.js
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
// import { auth, clerkClient } from "@clerk/nextjs/dist/types/server";

export async function POST(req) {
  try {
    // const { userId } = auth();
     const { userId } = getAuth(req);
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { username } = await req.json();
    const trimmed = username.trim().toLowerCase();

    const existing = await prisma.user.findUnique({ where: { username: trimmed } });

    if (existing && existing.clerkUserId !== userId) {
      return new Response(
        JSON.stringify({ error: "Username already taken" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await prisma.user.update({
      where: { clerkUserId: userId },
      data: { username: trimmed },
    });
    const client= await clerkClient();
   await  client.users.updateUser(userId,{username:trimmed})

    // (await clerkClient()).users.
    // updateUser(userId, {
    //   username: trimmed,
    // });
   
    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
