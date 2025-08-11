import Topbar from "@/app/workflow/_components/topbar/Topbar";
import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import ExecutionViewer from "./_components/ExecutionViewer";

export default async function ExecutionViewerPage({params}: {params: {executionId:string, workflowId: string}}){
    const { workflowId, executionId } = await params;

    return (
        <div className="flex flex-col h-screen w-full overflow-hidden">
            <Topbar workflowId={workflowId} title="Workflow Run Details" subTitle={`Run ID: ${executionId}`} hideButtons />
            <section className="flex h-full overflow-auto">
                <Suspense fallback={
                    <div className="flex w-full items-center justify-center">
                        <Loader2Icon className="h-10 w-10 animate-spin stroke-primary" />
                    </div>
                }>
                    <ExecutionViewerWrapper executionId={executionId} />
                </Suspense>
            </section>
        </div>
    )
}

async function ExecutionViewerWrapper( {executionId} :{executionId : string}) {

    const workflowExecution = await GetWorkflowExecutionWithPhases(executionId)

    if (!workflowExecution) {
        notFound()
    }

    return <ExecutionViewer initialData={workflowExecution} />
}