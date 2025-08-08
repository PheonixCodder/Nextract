import { LucideProps } from "lucide-react"
import { TaskParam, TaskType } from "./task"
import { FC } from "react";
import { AppNode } from "./appNodes";


export type LucideIcon = FC<LucideProps>;

export enum WorkflowStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
}

export type WorkflowTask = {
    label : string
    icon : LucideIcon
    type : TaskType
    isEntryPoint ?: boolean
    inputs : TaskParam[]
    outputs : TaskParam[]
    credits : number
}

export type WorkflowExecutionPlanPhase = {
    phase : number
    nodes : AppNode[]
}

export type WorkflowExecutionPlan = WorkflowExecutionPlanPhase[]

export enum WorkflowExecutionStatus {
    PENDING = 'PENDING',
    RUNNING = 'RUNNING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}

export enum ExecutionPhaseStatus {
    CREATED = 'CREATED',
    PENDING = 'PENDING',
    RUNNING = 'RUNNING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}

export enum WorkflowExecutionTrigger {
    MANUAL = 'MANUAL',
}