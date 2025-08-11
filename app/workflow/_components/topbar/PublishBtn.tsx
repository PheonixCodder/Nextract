"use client";

import { PublishWorkflow } from "@/actions/workflows/publishWorkflow";
import { RunWorkflow } from "@/actions/workflows/runWorkFlow";
import useExecutionPlan from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { Loader2Icon, PlayIcon, UploadIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const PublishBtn = ({ workflowId }: { workflowId: string }) => {
  const router = useRouter();
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();
  const mutation = useMutation({
    mutationFn: PublishWorkflow,
    onSuccess: () => {
      toast.success("Workflow Published", { id: "flow-publish" });
    },
    onError: (error) => {
      toast.error(error.message, { id: "flow-publish" });
    },
  });
  return (
    <Button
      disabled={mutation.isPending}
      className="flex items-center gap-2"
      variant={"outline"}
      onClick={() => {
        const plan = generate();
        if (!plan) {
          return;
        }
        toast.loading("Publishing workflow", { id: "flow-publish" });
        mutation.mutate({
          id: workflowId,
          flowDefinition: JSON.stringify(toObject()),
        });
      }}
    >
      {mutation.isPending ? (
        <UploadIcon className="animate-spin" />
      ) : (
        <UploadIcon size={16} className="stroke-green-400" />
      )}
      <span>Publish</span>
    </Button>
  );
};

export default PublishBtn;
