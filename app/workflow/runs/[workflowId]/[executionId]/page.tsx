import Topbar from "@/app/workflow/_components/topbar/Topbar";
import { Loader2Icon } from "lucide-react";
import React, { Suspense } from "react";
import ExecutionViewerWrapper from "./_components/ExecutionViewerWrapper";

export default async function ExecutionViewerPage({
  params,
}: {
  params: {
    workflowId: string;
    executionId: string;
  };
}) {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Topbar
        workflowId={(await params).workflowId}
        title="Workflow run details"
        subtitle={`Run ID: ${(await params).executionId}`}
        hideButtons
      />
      <section className="flex h-full overflow-auto">
        <Suspense
          fallback={
            <div className="flex items-center justify-center w-full h-full">
              <Loader2Icon className="size-10 animate-spin stroke-primary" />
            </div>
          }
        >
          <ExecutionViewerWrapper executionId={(await params).executionId} />
        </Suspense>
      </section>
    </div>
  );
}