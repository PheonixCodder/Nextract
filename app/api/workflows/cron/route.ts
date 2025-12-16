import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAppUrl } from "@/lib/helper/appUrl";
import { checkWorkflowCredits } from "@/lib/workflow/creditCheck";
import { WorkflowStatus } from "@/types/workflow";
import { parseWorkflowSchedule } from "@/lib/cron/scheduleParser";

/**
 * Cron executor endpoint
 * Triggered by an external scheduler or platform cron
 */
export async function GET(req: NextRequest) {
  const now = new Date();

  const workflows = await prisma.workflow.findMany({
    select: {
      id: true,
      cron: true,
      userId: true,
      creditsCost: true,
      name: true,
    },
    where: {
      status: WorkflowStatus.PUBLISHED,
      cron: { not: null },
      nextRunAt: { lte: now },
    },
  });

  const workflowsRun: any[] = [];
  const workflowsSkipped: any[] = [];

  for (const workflow of workflows) {
    const creditCheckResult = await checkWorkflowCredits(workflow.id);

    if (creditCheckResult.canExecute) {
      await triggerWorkflow(workflow.id);

      workflowsRun.push({
        id: workflow.id,
        name: workflow.name,
        creditsCost: workflow.creditsCost,
        userCredits: creditCheckResult.userCredits,
      });

      console.log(
        `Triggered workflow ${workflow.name} (${workflow.id})`
      );
    } else {
      console.log(
        `Skipping workflow ${workflow.name}: ${creditCheckResult.reason}`
      );

      if (
        creditCheckResult.reason === "insufficient_credits" &&
        creditCheckResult.workflow
      ) {
        const { logWorkflowCreditFailure } = await import(
          "@/lib/workflow/creditCheck"
        );

        await logWorkflowCreditFailure(
          creditCheckResult.workflow.id,
          creditCheckResult.workflow.userId,
          creditCheckResult.workflow.creditsCost,
          creditCheckResult.userCredits || 0
        );
      }

      workflowsSkipped.push({
        id: workflow.id,
        name: workflow.name,
        reason: creditCheckResult.reason,
        required: workflow.creditsCost,
        available: creditCheckResult.userCredits || 0,
      });
    }

    // Update next run time
    if (workflow.cron) {
      try {
        const nextRunAt = calculateNextRun(workflow.cron);

        if (nextRunAt) {
          await prisma.workflow.update({
            where: { id: workflow.id },
            data: {
              nextRunAt,
              lastRunAt: creditCheckResult.canExecute ? now : undefined,
            },
          });
        }
      } catch (error) {
        console.error(
          `Failed to update next run for workflow ${workflow.id}`,
          error
        );
      }
    }
  }

  return NextResponse.json(
    {
      workflowsScheduled: workflows.length,
      workflowsRun: workflowsRun.length,
      workflowsRunDetails: workflowsRun,
      workflowsSkipped: workflowsSkipped.length,
      skippedDetails: workflowsSkipped,
      timestamp: now.toISOString(),
    },
    { status: 200 }
  );
}

/**
 * Calculate next execution time from cron expression
 */
function calculateNextRun(scheduleExpression: string): Date | null {
  const parsed = parseWorkflowSchedule(scheduleExpression);

  if (parsed.isValid && parsed.nextRunDate) {
    return parsed.nextRunDate;
  }

  console.error(`Invalid schedule expression: ${scheduleExpression}`);
  return null;
}

/**
 * Trigger workflow execution via internal API
 */
async function triggerWorkflow(workflowId: string) {
  const triggerApiUrl = getAppUrl(
    `api/workflows/execute?workflowId=${workflowId}`
  );

  try {
    const response = await fetch(triggerApiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.API_SECRET!}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `Failed to trigger workflow ${workflowId}: ${response.status}`
      );
    }
  } catch (err: any) {
    console.error(
      `Failed to trigger workflow ${workflowId}`,
      err.message
    );
  }
}
