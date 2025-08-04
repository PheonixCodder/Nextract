'use client'

import React, { useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { useMutation } from '@tanstack/react-query'
import { DeleteWorkflow } from '@/actions/workflows/deleteWorkflow'
import { toast } from 'sonner'

interface Props {
    open: boolean
    setOpen: (open: boolean) => void
    workflowName: string
    workflowId : string
}

const DeleteWorkflowDialog = ({ open, setOpen, workflowName, workflowId }: Props) => {
    const [confirmText, setConfirmText] = useState('')

    const deleteMutation = useMutation({
        mutationFn: DeleteWorkflow,
        onSuccess: () => {
            toast.success('Workflow deleted successfully', { id: 'delete-workflow' })
            setConfirmText('')
        },
        onError: (error: Error) => {
            toast.error(`Failed to delete workflow: ${error.message}`, { id: 'delete-workflow' })
        }
    })

return (
    <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle className='text-center'>Are you Sure?</AlertDialogTitle>
                <AlertDialogDescription className='text-center'>If you delete this workflow, all associated tasks will be deleted as well.</AlertDialogDescription>
                <div className='flex flex-col py-4 gap-2 text-center'>
                    <p className='text-[13px] text-muted-foreground'>if you are sure, enter <b>{workflowName}</b> to confirm:</p>
                    <Input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
                </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setConfirmText('')}>Cancel</AlertDialogCancel>
                <AlertDialogAction className='bg-destructive text-destructive-foreground hover:bg-destructive/80' disabled={confirmText !== workflowName || deleteMutation.isPending} onClick={() =>{
                    toast.loading('Deleting workflow...', { id: 'delete-workflow' })
                    deleteMutation.mutate(workflowId)
                } }>Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
)
}

export default DeleteWorkflowDialog
