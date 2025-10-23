import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    'Password must contain at least one special character'
  );

export const loginFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
});

export const loginCredentialsSchema = loginFormSchema.extend({
  device_name: z.string().default('nextjs-web'),
});

export const registerSchema = z
  .object({
    name: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    password: passwordSchema,
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters'),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Token is required'),
    email: z
      .string()
      .email('Please enter a valid email address')
      .min(5, 'Email must be at least 5 characters'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name too long'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters'),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const baseRegistrationSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(255),
    email: z.string().email('Invalid email address'),
    password: passwordSchema,
    confirmPassword: z.string(),
    phone: z.string().min(1, 'Phone number is required').max(20),
    terms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and privacy policy',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const candidateRegistrationSchema = baseRegistrationSchema.safeExtend({
  role: z.literal('candidate'),
  profession: z.string().min(1, 'Profession is required').max(255),
  summary: z
    .string()
    .min(10, 'Summary must be at least 10 characters')
    .max(1000)
    .optional(),
});

export const recruiterRegistrationSchema = baseRegistrationSchema.safeExtend({
  role: z.enum(['recruiter', 'recruiter_admin']),
  company_name: z.string().min(1, 'Company name is required').max(255),
  position: z.string().min(1, 'Position is required').max(255),
});

export type CandidateRegistrationData = z.infer<
  typeof candidateRegistrationSchema
>;
export type RecruiterRegistrationData = z.infer<
  typeof recruiterRegistrationSchema
>;
export type RegistrationData =
  | CandidateRegistrationData
  | RecruiterRegistrationData;
export type LoginFormData = z.infer<typeof loginFormSchema>;
export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
