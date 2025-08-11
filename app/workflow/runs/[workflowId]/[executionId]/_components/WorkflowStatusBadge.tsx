import { WorkflowExecutionStatus } from '@/types/workflow'
import { CircleCheckIcon, CircleDashedIcon, CircleXIcon, Loader2Icon } from 'lucide-react'
import React from 'react'

const WorkflowStatusBadge = ({status}:{status: WorkflowExecutionStatus}) => {
    switch(status){
      case (WorkflowExecutionStatus.PENDING):
        return <CircleDashedIcon size={20} className='stroke-muted-foreground' />
      case (WorkflowExecutionStatus.COMPLETED):
        return <CircleCheckIcon size={20} className='stroke-green-500' />
      case (WorkflowExecutionStatus.RUNNING):
        return <Loader2Icon size={20} className='animate-spin stroke-yellow-500' />
      case (WorkflowExecutionStatus.FAILED):
        return <CircleXIcon size={20} className='stroke-destructive' />
      default:
        return <div className='rounded-full'>{status}</div>
    }
}

export default WorkflowStatusBadge
