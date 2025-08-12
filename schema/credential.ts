import { z } from 'zod'

export const createCredentialSchema = z.object({
    name : z.string().min(1, 'Name is required'),
    value : z.string().min(1, 'Value is required').max(80),
})

export type createCredentialSchemaType = z.infer<typeof createCredentialSchema>