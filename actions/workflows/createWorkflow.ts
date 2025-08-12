'use server'

import { AppNode } from './../../types/appNodes';
import prisma from "@/lib/prisma";
import { createWorkflowSchema, createWorkflowSchemaType } from "@/schema/workflow";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { Edge } from '@xyflow/react'
import { CreateFlowNode } from '@/lib/workflow/createFlowNode';
import { TaskType } from '@/types/task';

export async function CreateWorkflow( form : createWorkflowSchemaType ){
    const { success, data } = createWorkflowSchema.safeParse(form)
    
    if (!success) {
        throw new Error('Invalid form data')
    }
    const { userId } = await auth()

    if (!userId){
        throw new Error('User is not authenticated')
    }

    const initialFlow : {nodes: AppNode[], edges: Edge[]} = {
      nodes: [],
      edges: []
    }

    initialFlow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER))
    
    const existingWorkflow = await prisma.workflow.findUnique({
    where: {
      name_userId: {
        name: data.name,
        userId: userId,
      },
    },
  });

  if (existingWorkflow) {
    throw new Error('A workflow with this name already exists for your account');
  }

    const result = await prisma.workflow.create({
        data:{
            userId,
            status: WorkflowStatus.DRAFT,
            definition: JSON.stringify(initialFlow),
            name: data.name,
            description: data.description,
        }
    });

    if (!result){
        throw new Error('Failed to create workflow')
    }
    return result;
}