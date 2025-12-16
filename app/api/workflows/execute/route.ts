import prisma from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionTrigger,
  WorkflowExecutionPlan,
  WorkflowExecutionStatus,
} from "@/types/workflow";
import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { parseWorkflowSchedule } from "@/lib/cron/scheduleParser";

function isValidSecret(secret: string): boolean {
  const API_SECRET = process.env.API_SECRET;
  if (!API_SECRET) return false;

  try {
    return timingSafeEqual(
      Buffer.from(secret),
      Buffer.from(API_SECRET)
    );
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  if (!isValidSecret(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workflowId = req.nextUrl.searchParams.get("workflowId");
  if (!workflowId) {
    return NextResponse.json(
      { error: "WorkflowId is required" },
      { status: 400 }
    );
  }

  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId },
  });

  if (!workflow) {
    return NextResponse.json(
      { error: "Workflow not found" },
      { status: 404 }
    );
  }

  const executionPlan = JSON.parse(
    workflow.executionPlan!
  ) as WorkflowExecutionPlan;

  try {
    const isCronTrigger = workflow.cron !== null;
    let nextRun: Date | null = null;

    if (isCronTrigger && workflow.cron) {
      const parsed = parseWorkflowSchedule(workflow.cron);
      if (parsed.isValid && parsed.nextRunDate) {
        nextRun = parsed.nextRunDate;
      }
    }

    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId,
        userId: workflow.userId,
        definition: workflow.definition,
        status: WorkflowExecutionStatus.PENDING,
        startedAt: new Date(),
        trigger: isCronTrigger
          ? WorkflowExecutionTrigger.CRON
          : WorkflowExecutionTrigger.MANUAL,
        phases: {
          create: executionPlan.flatMap((phase) =>
            phase.nodes.map((node) => ({
              userId: workflow.userId,
              status: ExecutionPhaseStatus.CREATED,
              number: phase.phase,
              node: JSON.stringify(node),
              name: TaskRegistry[node.data.type].label,
            }))
          ),
        },
      },
    });

    // IMPORTANT: await this (serverless correctness)
    await ExecuteWorkflow(execution.id, nextRun ?? undefined);

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Error executing workflow:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
