import { z } from "zod";

export const createWorkflowSchema = z.object({
  name: z.string().nonempty("Name is required").max(50),
  description: z.string().max(80).optional(),
});

export type createWorkflowSchemaType = z.infer<typeof createWorkflowSchema>;

export const duplicateWorkflowSchema = createWorkflowSchema.extend({
  workflowId: z.string(),
});

export type duplicateWorkflowSchemaType = z.infer<
  typeof duplicateWorkflowSchema
>;