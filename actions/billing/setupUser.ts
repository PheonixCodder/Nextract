import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function SetupUser(userId: string) {
  // const balance = await prisma.userBalance.findUnique({
  //   where: {
  //     userId,
  //   },
  // });
  // if (!balance) {
  //   await prisma.userBalance.create({
  //     data: {
  //       userId,
  //       credits: 100,
  //     },
  //   });
  // }

  // Use upsert instead of separate find and create
  try {
  await prisma.userBalance.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      credits: 1000,
    },
    update: {}, // If record exists, don't update anything
  });
} catch (e) {
  throw Error(e)
}

  redirect("/");
}