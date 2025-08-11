"use client";

import { RunWorkflow } from "@/actions/workflows/runWorkFlow";
import { UnpublishWorkflow } from "@/actions/workflows/unPublishWorkflow";
import useExecutionPlan from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { DownloadIcon, Loader2Icon, PlayIcon, UploadIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const UnpublishBtn = ({ workflowId }: { workflowId: string }) => {
  const router = useRouter();
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();
  const mutation = useMutation({
    mutationFn: UnpublishWorkflow,
    onSuccess: () => {
      toast.success("Workflow Published", { id: "flow-Unpublish" });
    },
    onError: (error) => {
      toast.error(error.message, { id: "flow-Unpublish" });
    },
  });
  return (
    <Button
      disabled={mutation.isPending}
      className="flex items-center gap-2"
      variant={"outline"}
      onClick={() => {
        toast.loading("UnPublishing workflow", { id: "flow-Unpublish" });
        mutation.mutate(workflowId);
      }}
    >
      {mutation.isPending ? (
        <DownloadIcon className="animate-spin" />
      ) : (
        <DownloadIcon size={16} className="stroke-orange-500" />
      )}
      <span>Unpublish</span>
    </Button>
  );
};

export default UnpublishBtn;
