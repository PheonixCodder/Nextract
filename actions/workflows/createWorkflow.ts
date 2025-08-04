'use server'

import prisma from "@/lib/prisma";
import { createWorkflowSchema, createWorkflowSchemaType } from "@/schema/workflow";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateWorkflow( form : createWorkflowSchemaType ){
    const { success, data } = createWorkflowSchema.safeParse(form)
    if (!success) {
        throw new Error('Invalid form data')
    }
    const { userId } = await auth()

    if (!userId){
        throw new Error('User is not authenticated')
    }

    
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
            definition: 'TODO',
            ...data
        }
    });

    if (!result){
        throw new Error('Failed to create workflow')
    }
    return result;
}