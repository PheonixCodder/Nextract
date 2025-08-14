import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
export async function DownloadInvoice(id: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You are not Authenticated");
  }

  const purchase = await prisma.transaction.findUnique({
    where:{
        id,
        userId
    }
  })
  if (!purchase){
    throw new Error("Purchase not found");
  }
}
