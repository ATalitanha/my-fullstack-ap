/**
 * Reason: Defines Zod schemas for validating authentication-related API inputs.
 * This ensures type safety and prevents invalid data from reaching the business logic.
 */
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'ایمیل نامعتبر است' }),
  password: z.string().min(6, { message: 'پسورد باید حداقل ۶ کاراکتر باشد' }),
});

export const signupSchema = z.object({
  username: z.string().min(3, { message: 'نام کاربری باید حداقل ۳ کاراکتر باشد' }),
  email: z.string().email({ message: 'ایمیل نامعتبر است' }),
  password: z.string().min(6, { message: 'پسورد باید حداقل ۶ کاراکتر باشد' }),
});
