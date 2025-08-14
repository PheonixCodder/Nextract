"use server";

import prisma from "@/lib/prisma";
import { getCreditsPack, PackId } from "@/types/billing";
import { auth } from "@clerk/nextjs/server";

export async function PurchaseCredits({packId,transactionId}:{packId: PackId, transactionId: string}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You are not Authenticated");
  }

  const selectedPack = getCreditsPack(packId);

  await prisma.transaction.upsert({
    where:{userId},
    create: {
      userId,
      credits : selectedPack.credits
    },
    update:{
      credits: {
        increment: selectedPack.credits
      }
    }
  })
  return await prisma.transaction.create({
    data: {
      userId: userId, // Track user with their userId
      planId: packId,
      transactionId: transactionId, // Subscription ID from Braintree
      price: selectedPack.price / 100,
      credits: selectedPack.credits, // Associated credits for the subscription
    },
  });
}
