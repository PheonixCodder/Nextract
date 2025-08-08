'use client'

import { RunWorkflow } from '@/actions/workflows/runWorkFlow'
import useExecutionPlan from '@/components/hooks/useExecutionPlan'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { useReactFlow } from '@xyflow/react'
import { PlayIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

const ExecuteBtn = ({workflowId}:{workflowId : string}) => {
  const generate = useExecutionPlan()
  const { toObject } = useReactFlow()
  const mutation = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: () => {
      toast.success('Execution Started', {id: 'flow-execution'})
    },
    onError: (error) => {
      toast.error(error.message, {id: 'flow-execution'})
      },
  })
  return (
    <Button disabled={mutation.isPending} className='flex items-center gap-2' variant={'outline'} onClick={() => {
      const plan = generate()
      if (!plan) {
        return
      }
      mutation.mutate({workflowId: workflowId, flowDefinition: JSON.stringify(toObject())})
    }}>
        <PlayIcon size={16} className='stroke-orange-400' />
        <span>Execute</span>
    </Button>
  )
}

export default ExecuteBtn
