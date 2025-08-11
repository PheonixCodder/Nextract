import { GetAppUrl } from "@/lib/helper/appUrl";
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { NextResponse } from "next/server";

export async function GET(req: Request){
    const now = new Date();
    const workflows = await prisma.workflow.findMany({
        select: {id : true},
        where : {
            status: WorkflowStatus.PUBLISHED,
            cron : {not:null},
            nextRunAt : {lte : now}
        }
    })
    for (const workflow of workflows){
        triggerWorkflow(workflow.id)
    }

    return NextResponse.json({
        message: 'Hi'
    }, {status : 200})
}

function triggerWorkflow(workflowId: string){
    const triggerApiUrl = GetAppUrl(`api/workflows/execute?workflowId=${workflowId}`)
    fetch(triggerApiUrl, {
        headers: {
            Authorization : `Bearer ${process.env.API_SECRET}`
        },
        cache:'no-store',
    }).catch((error)=>{
        console.error(error)
    })
}