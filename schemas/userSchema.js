const { z } = require("zod");

const nameRegex = /^[A-Za-z\s]+$/;
const departmentRegex = /^[A-Za-z\s]+$/;

const registerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required")
  .regex(nameRegex, "Please enter a valid first name"),

  lastName: z.string().trim().min(1, "Last name is required")
  .regex(nameRegex, "Please enter a valid last name"),
  
  email: z.email("Invalid email format"),
  
  password: z.string().min(6, "Password must be at least 6 characters"),
  
  phone: z.string()
    .trim()
    .regex(/^[6-9][0-9]{9}$/, "Enter a valid 10-digit mobile number."),
  
  department: z.string().trim().min(2, "Department must be at least 2 characters").max(100, "Department must not exceed 100 characters"),
});

const loginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(1, "Please enter password")
});

const forgetPasswordSchema = z.object({
  email: z.email("Invalid email format"),
});

const resetPasswordSchema = z.object({
  password: z.string().min(1, "Please enter password"),
  token: z.string().refine((val) => val.split(".").length === 3, {
          message: "Invalid reset token",
      }),
});

module.exports = {registerSchema, loginSchema, forgetPasswordSchema, resetPasswordSchema}