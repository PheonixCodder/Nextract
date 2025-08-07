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

export type WorkflowExecutionPlan = {
    phase : number
    nodes : AppNode[]
}[]