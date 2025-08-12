"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetCredential(credentials: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You are not Authenticated");
  }

  const credential = await prisma.credential.findUnique({
    where: {
      name_userId: {
        name: credentials,
        userId: userId,
      },
    },
  });
  return credential;
}
