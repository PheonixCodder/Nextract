"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";


export async function GetUserPurchaseHistory() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You are not Authenticated");
  }

  return await prisma.transaction.findMany({
    where: {
        userId
    },
    orderBy : {
        completedAt : 'asc'
    }
  })
}
