'use client'

import React, { useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { useMutation } from '@tanstack/react-query'
import { DeleteCredential } from '@/actions/credentials/deleteCredential'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { XIcon } from 'lucide-react'

interface Props {
    credentialName: string
}

const DeleteCredentialDialog = ({ credentialName }: Props) => {
    const [confirmText, setConfirmText] = useState('')
    const [open , setOpen] = useState(false)

    const deleteMutation = useMutation({
        mutationFn: DeleteCredential,
        onSuccess: () => {
            toast.success('Credential deleted successfully', { id: 'delete-credential' })
            setOpen(prev => !prev)
            setConfirmText('')
        },
        onError: (error: Error) => {
            toast.error(`Failed to delete credential: ${error.message}`, { id: 'delete-credential' })
        }
    })

return (
    <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
            <Button variant={'destructive'} size={'icon'}>
                <XIcon size={18} />
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle className='text-center'>Are you Sure?</AlertDialogTitle>
                <AlertDialogDescription className='text-center'>If you delete this credential, all associated tasks will be deleted as well.</AlertDialogDescription>
                <div className='flex flex-col py-4 gap-2 text-center'>
                    <p className='text-[13px] text-muted-foreground'>if you are sure, enter <b>{credentialName}</b> to confirm:</p>
                    <Input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
                </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setConfirmText('')}>Cancel</AlertDialogCancel>
                <AlertDialogAction className='bg-destructive text-destructive-foreground hover:bg-destructive/80' disabled={confirmText !== credentialName || deleteMutation.isPending} onClick={() =>{
                    toast.loading('Deleting credential...', { id: 'delete-credential' })
                    deleteMutation.mutate(credentialName)
                } }>Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
)
}

export default DeleteCredentialDialog
