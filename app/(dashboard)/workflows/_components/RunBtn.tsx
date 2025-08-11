import { RunWorkflow } from '@/actions/workflows/runWorkFlow'
import useExecutionPlan from '@/components/hooks/useExecutionPlan'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { useReactFlow } from '@xyflow/react'
import { Loader2Icon, PlayIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

const RunBtn = ({workflowId}:{workflowId : string}) => {
    const router = useRouter()
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
    <Button variant={'outline'} size={'sm'} className='flex items-center gap-2' disabled={mutation.isPending} onClick={()=>{
        toast.loading('Scheduling Execution', {id: 'flow-execution'})
        mutation.mutate({workflowId})
    }}>
        {mutation.isPending ? <Loader2Icon className='animate-spin' /> : <PlayIcon size={16} className=''/>}
        <span>Run</span>
    </Button>
  )
}

export default RunBtn
