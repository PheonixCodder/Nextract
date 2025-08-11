import prisma from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionPlan,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
} from "@/types/workflow";
import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import CronExpressionParser from "cron-parser";


function isValid(secret: string) {
  const API_SECRET = process.env.API_SECRET;
  if (!API_SECRET) return false;

  try {
    return timingSafeEqual(Buffer.from(secret), Buffer.from(API_SECRET));
  } catch (error) {
    return false;
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secret = authHeader.split(" ")[1];
  if (!isValid(secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  console.log(searchParams)
  const workflowId = searchParams.get("workflowId") as string;

  if (!workflowId) {
    return NextResponse.json(
      {
        error: "Missing required parameter: workflowId",
      },
      { status: 400 }
    );
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
    },
  });
  if (!workflow) {
    return NextResponse.json(
      {
        error: "Workflow not found",
      },
      { status: 404 }
    );
  }
  const executionPlan = JSON.parse(
    workflow.executionPlan
  ) as WorkflowExecutionPlan;

  if (!executionPlan) {
    return NextResponse.json(
      {
        error: "Invalid execution plan",
      },
      { status: 400 }
    );
  }


  try {
    const cron = CronExpressionParser.parse(workflow.cron)
    const nextRun = cron.next().toDate()
    const execution = await prisma.workflowExecution.create({
    data: {
      workflowId: workflowId,
      userId: workflow.userId,
      definition: workflow.definition,
      status: WorkflowExecutionStatus.PENDING,
      startedAt: new Date(),
      trigger: WorkflowExecutionTrigger.CRON,
      phases: {
        create: executionPlan.flatMap((phase) => {
          return phase.nodes.flatMap((node) => {
            return {
              userId: workflow.userId,
              status: ExecutionPhaseStatus.CREATED,
              number: phase.phase,
              node: JSON.stringify(node),
              name: TaskRegistry[node.data.type].label,
            };
          });
        }),
      },

    },
  });

  await ExecuteWorkflow(execution.id, nextRun)
  return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return NextResponse.json({
        error: "Invalid cron expression",
        },
        { status: 500 })
    }
  }


