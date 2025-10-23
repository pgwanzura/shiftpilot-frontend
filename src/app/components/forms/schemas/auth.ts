import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
  remember: z.boolean().default(false),
});

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

// STEP-BASED REGISTRATION SCHEMAS

// Step 1: Ultra-minimal - Email + Password only
export const registrationStep1Schema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: passwordSchema,
  })
  .refine((data) => data.password.length >= 8, {
    message: 'Password must be at least 8 characters',
    path: ['password'],
  });

// Step 2: Agency Details - Everything else
export const agencyStep2Schema = z.object({
  name: z.string().min(1, 'Full name is required').max(255),
  phone: z.string().min(1, 'Phone number is required').max(20),
  company_name: z.string().min(1, 'Company name is required').max(255),
  billing_email: z.string().email('Invalid billing email'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  terms: z.boolean().refine((val) => val == true, {
    message: 'You must accept the terms and privacy policy',
  }),
});

// Step 2: Employer Details - Everything else
export const employerStep2Schema = z.object({
  name: z.string().min(1, 'Full name is required').max(255),
  phone: z.string().min(1, 'Phone number is required').max(20),
  company_name: z.string().min(1, 'Company name is required').max(255),
  billing_email: z.string().email('Invalid billing email'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and privacy policy',
  }),
});

// COMPLETE REGISTRATION SCHEMAS
export const agencyRegistrationSchema = registrationStep1Schema
  .merge(agencyStep2Schema)
  .extend({
    role: z.literal('agency_admin'),
  });

export const employerRegistrationSchema = registrationStep1Schema
  .merge(employerStep2Schema)
  .extend({
    role: z.literal('employer_admin'),
  });

export type RegistrationStep1Data = z.infer<typeof registrationStep1Schema>;
export type AgencyStep2Data = z.infer<typeof agencyStep2Schema>;
export type EmployerStep2Data = z.infer<typeof employerStep2Schema>;

export type AgencyRegistrationData = z.infer<typeof agencyRegistrationSchema>;
export type EmployerRegistrationData = z.infer<
  typeof employerRegistrationSchema
>;
export type RegistrationData =
  | AgencyRegistrationData
  | EmployerRegistrationData;

export type LoginFormData = z.infer<typeof loginFormSchema>;
export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
