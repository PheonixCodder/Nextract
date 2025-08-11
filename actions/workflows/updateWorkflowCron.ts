"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { CronExpressionParser } from "cron-parser";
import { revalidatePath } from "next/cache";

export async function UpdateWorkflowCron({
  id,
  cron,
}: {
  id: string;
  cron: string;
}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You are not Authenticated");
  }
  try {
    const interval = CronExpressionParser.parse(cron);
    console.log(interval.next().toDate());
    await prisma.workflow.update({
      where: {
        id,
        userId,
      },
      data: {
        cron,
        nextRunAt: interval.next().toDate(),
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error(`Invalid Cron Expression: ${error.message}`);
  }

  revalidatePath('workflows')
}
