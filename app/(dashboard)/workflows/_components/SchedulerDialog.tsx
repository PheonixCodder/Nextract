"use client";

import { UpdateWorkflowCron } from "@/actions/workflows/updateWorkflowCron";
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { CalendarIcon, ClockIcon, TriangleAlertIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import cronstrue from 'cronstrue'
import CronExpressionParser from "cron-parser";

type Props = {
    workflowId : string
    cron : string | null
}

const SchedulerDialog = (props:Props) => {
    const [cron, setCron] = useState(props.cron || '');
    const [validCron , setValidCron] = useState(false);
    const [readableCron, setReadableCron] = useState('')

    useEffect(()=>{
        try {
            CronExpressionParser.parse(cron)
            const humanCronStr = cronstrue.toString(cron)
            setValidCron(true)
            setReadableCron(humanCronStr)
        } catch (error) {
            setValidCron(false)
        }
    },[cron])

    const workflowHasValidCron = props.cron && props.cron.length > 0;
    const readableSavedCron = workflowHasValidCron && cronstrue.toString(props.cron!)

  const mutation = useMutation({
    mutationFn: UpdateWorkflowCron,
    onSuccess: () => {
      toast.success('Schedule updated successfully', {id: 'workflow-cron'});
    },
    onError: (error) => {
        toast.error(`Failed to update schedule: ${error}`, {id: 'workflow-cron'});
    },
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"link"}
          size={"sm"}
          className={cn("text-sm p-0 h-auto text-orange-500", workflowHasValidCron && 'text-primary')}
        >
          {workflowHasValidCron && (
            <div className="flex items-center gap-2">
              <ClockIcon />
              {readableSavedCron}
            </div>
          )}
          {!workflowHasValidCron && (
          <div className="flex items-center gap-1">
            <TriangleAlertIcon className="h-3 w-3 mr-1" />
            Set Schedule
          </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          title="Schedule Workflow Execution"
          icon={CalendarIcon}
        />
        <div className="p-6 space-y-4">
          <p>Specify a cron expression to schedule the workflow execution.</p>
          <Input placeholder="E.g ., 0 0 * * * ?" value={cron} onChange={(e) => setCron(e.target.value)} />
          <div className={cn('bg-accent rounded-md p-4 border text-sm border-destructive text-destructive', validCron && 'border-primary text-primary')}>{validCron ? readableCron : "Invalid cron expression"}</div>
        </div>
        <DialogFooter className="px-6 gap-2">
          <DialogClose asChild>
            <Button variant={"secondary"} className="w-full">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button disabled={!validCron} className="w-full" onClick={()=>{
                toast.loading('Saving schedule', {id: 'workflow-cron'});
                mutation.mutate({
                    id : props.workflowId,
                    cron: cron
                });
            }}>Save</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SchedulerDialog;
