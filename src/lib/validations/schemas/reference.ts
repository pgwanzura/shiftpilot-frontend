import { z } from 'zod';

export const referenceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  jobTitle: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  timeKnown: z.string().min(1, 'Time worked together is required'),
  confidential: z.boolean().optional(),
  reminders: z.boolean().optional(),
  message: z.string().optional(),
});

export type ReferenceFormData = z.infer<typeof referenceSchema>;
