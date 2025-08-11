import { z } from 'zod'

export const createWorkflowSchema = z.object({
    name : z.string().min(1, 'Name is required'),
    description : z.string().max(80).optional(),
})

export type createWorkflowSchemaType = z.infer<typeof createWorkflowSchema>

export const duplicateWorkflowSchema = createWorkflowSchema.extend({
    workflowId : z.string()
})

export type duplicateWorkflowSchemaType = z.infer<typeof duplicateWorkflowSchema>