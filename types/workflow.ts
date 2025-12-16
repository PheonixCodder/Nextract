import { LucideProps } from "lucide-react";
import React from "react";
import { TaskParam, TaskType, TaskCategory } from "./taskType";
import { AppNode } from "./appNodes";

export enum WorkflowStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export type WorkflowTask = {
  label: string;
  icon: React.FC<LucideProps>;
  type: TaskType;
  category?: TaskCategory;
  isEntryPoint?: boolean;
  inputs: TaskParam[];
  outputs: TaskParam[];
  credits: number;
  description?: string;
};

export type WorkflowExecutionPlanPhase = {
  phase: number;
  nodes: AppNode[];
};

export type WorkflowExecutionPlan = WorkflowExecutionPlanPhase[];

export enum WorkflowExecutionTrigger {
  MANUAL = "MANUAL",
  CRON = "CRON",
  SCHEDULED = "SCHEDULED",
}

export enum WorkflowExecutionStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum ExecutionPhaseStatus {
  CREATED = "CREATED",
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}