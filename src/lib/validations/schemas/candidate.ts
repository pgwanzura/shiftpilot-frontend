import { z } from 'zod';

export const candidateFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  position: z.string().min(1, 'Position is required'),
  team: z.string().min(1, 'Team is required'),
  notes: z.string().optional(),
});
