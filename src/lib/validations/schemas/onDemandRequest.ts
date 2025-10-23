import { z } from 'zod';

export const onDemandRequestSchema = z
  .object({
    candidateId: z.string().min(1, 'Please select a candidate'),
    referenceType: z.enum([
      'professional',
      'academic',
      'character',
      'skill-specific',
    ]),
    urgency: z.enum(['low', 'normal', 'high', 'urgent']),
    message: z.string().min(1, 'Message is required'),
    specificSkills: z.array(z.string()).optional(),
    deadline: z.string().optional(),
    referenceCount: z.number().min(1).max(5),
    referees: z.array(
      z.object({
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        email: z.string().email('Invalid email address'),
        phone: z.string().optional(),
        relationship: z.string().min(1, 'Relationship is required'),
      })
    ),
    questions: z.array(z.string()).min(1, 'At least one question is required'),
  })
  .superRefine((data, ctx) => {
    if (data.referees.length < data.referenceCount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Please provide ${data.referenceCount} referees.`,
        path: ['referees'],
      });
    }
  });

export type OnDemandRequestFormData = z.infer<typeof onDemandRequestSchema>;
