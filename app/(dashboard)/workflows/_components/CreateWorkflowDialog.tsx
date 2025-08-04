'use client'

import React, { useCallback, useState, useEffect } from 'react'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Layers2Icon, Loader2 } from 'lucide-react'
import CustomDialogHeader from '@/components/CustomDialogHeader'
import { useForm } from 'react-hook-form'
import { createWorkflowSchema, createWorkflowSchemaType } from '@/schema/workflow'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useMutation } from '@tanstack/react-query'
import { CreateWorkflow } from '@/actions/workflows/createWorkflow'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation' // Import useRouter from next/navigation

const CreateWorkflowDialog = ({triggerText}: { triggerText?: string }) => {

  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false) // New state to track mounting

  // Ensure useRouter is used after the component has mounted
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const form = useForm<createWorkflowSchemaType>({
    resolver: zodResolver(createWorkflowSchema),
    defaultValues: {
      name: '',
      description: '',
    }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: CreateWorkflow,
    onSuccess: (data) => {
      toast.success('Workflow created', { id: 'create-workflow' })

      if (isMounted) {
        // Redirect only after component has mounted
        router.push(`/workflow/editor/${data.id}`)
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to create workflow: ${error.message}`, { id: 'create-workflow' })
    }
  })

  const onSubmit = useCallback((values: createWorkflowSchemaType) => {
    toast.loading('Creating workflow...', { id: 'create-workflow' })
    mutate(values)
  }, [mutate])

  if (!isMounted) {
    return null // Avoid rendering until after the component has mounted
  }

  return (
    <Dialog open={open} onOpenChange={(open)=>{
      form.reset()
      setOpen(open)
    }}>
      <DialogTrigger asChild>
        <Button>{triggerText ?? 'Create Workflow'}</Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader icon={Layers2Icon} title="Create Workflow" subTitle="Start building your workflow" />
        <div className="p-6">
          <Form {...form}>
            <form className="space-y-8 w-full" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex gap-1 items-center">
                    Name
                    <p className="text-xs text-primary">(required)</p>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Choose a description and unique name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex gap-1 items-center">
                    Description
                    <p className="text-xs text-muted-foreground">(optional)</p>
                  </FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide a brief description of what your workflow does. This is optional but can help you remember the workflow&apos;s purpose.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              <Button disabled={isPending} className="w-full" type="submit">
                {!isPending && 'Proceed'}{isPending && <Loader2 className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateWorkflowDialog
