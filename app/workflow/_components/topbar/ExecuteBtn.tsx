'use client'

import { RunWorkflow } from '@/actions/workflows/runWorkFlow'
import useExecutionPlan from '@/components/hooks/useExecutionPlan'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { useReactFlow } from '@xyflow/react'
import { Loader2Icon, PlayIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

const ExecuteBtn = ({workflowId}:{workflowId : string}) => {
  const router = useRouter()
  const generate = useExecutionPlan()
  const { toObject } = useReactFlow()
  const mutation = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: (url) => {
      toast.success('Execution Started', {id: 'flow-execution'})
      router.push(url)
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
      {mutation.isPending ? <Loader2Icon className='animate-spin' /> : <PlayIcon size={16} className='stroke-orange-400'/>}
        <span>Execute</span>
    </Button>
  )
}

export default ExecuteBtn
