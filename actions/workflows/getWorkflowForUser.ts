'use server'

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getWorkflow(workflowId:string) {
    const { userId } = await auth()
    if (!userId) {
        throw new Error('User not Authorized')
    }

    const workflow = await prisma.workflow.findUnique({
        where: {
            id: workflowId,
            userId
        }
    })

    if (!workflow) {
        return null
    }
    return workflow
}