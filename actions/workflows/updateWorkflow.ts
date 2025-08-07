'use server'

import prisma from "@/lib/prisma"
import { WorkflowStatus } from "@/types/workflow"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";

interface  Props {
    id: string;
    definition : string;
}

export async function updateWorkflow({ id, definition } : Props) {
    const { userId } = await auth()
    
    if (!userId) {
        throw new Error('User not Authenticated')
    }

    const workflow = await prisma.workflow.findUnique({
        where:{
            id,
            userId
        }
    })
    if (!workflow) {
        throw new Error('Workflow not found')
    }
    if (workflow.status !== WorkflowStatus.DRAFT) {
        throw new Error('Workflow is not a draft')
    }
    await prisma.workflow.update({
        data:{
            definition
        },
        where:{
            id,
            userId
        }
    })
    revalidatePath('/workflows')
}