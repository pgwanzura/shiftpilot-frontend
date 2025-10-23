import { z } from 'zod';

export const referenceRequestSchema = z.object({
  candidate: z.string().min(1, 'Please select a candidate'),
  referenceType: z.enum(['manager', 'peer', 'other']),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional().default(''),
  relationship: z.string().min(1, 'Relationship is required'),
  questions: z
    .array(z.string())
    .default([
      "How would you describe the candidate's strengths?",
      'What areas could the candidate improve?',
    ]),
});

export type ReferenceRequestFormData = z.infer<typeof referenceRequestSchema>;
