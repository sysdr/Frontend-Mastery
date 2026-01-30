// src/schemas.ts
import { z } from 'zod';

export const userProfileSchema = z.object({
  name: z.string()
    .min(3, { message: "Name must be at least 3 characters." })
    .max(50, { message: "Name cannot exceed 50 characters." }),
  email: z.string()
    .email({ message: "Invalid email address." }),
  age: z.number({ message: "Age must be a valid number." })
    .min(18, { message: "You must be at least 18 years old." })
    .max(120, { message: "Age seems a bit high, doesn't it." })
    .int({ message: "Age must be a whole number." })
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;
