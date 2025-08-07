import { updateWorkflow } from '@/actions/workflows/updateWorkflow'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { useReactFlow } from '@xyflow/react'
import { CheckIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

const SaveBtn = ({ workflowId } : { workflowId: string }) => {
    const { toObject } = useReactFlow()

    const saveMutation = useMutation({
        mutationFn: updateWorkflow,
        onSuccess: () => {
            toast.success('Flow saved successfully', {id: 'save-flow-success'})
        },
        onError: () => {
            toast.error('Error saving flow', {id: 'save-flow-error'})
        }
    })

  return (
    <Button disabled={saveMutation.isPending} variant={'outline'} className='flex items-center gap-2' onClick={()=>{
        const workflowDefinition = JSON.stringify(toObject())
        toast.loading('Saving flow...', {id: 'save-flow-success'})
        saveMutation.mutate({
            id : workflowId,
            definition: workflowDefinition
        })
    }}>
        <CheckIcon size={16} className='stroke-green-400' />
        Save
    </Button>
  )
}

export default SaveBtn
