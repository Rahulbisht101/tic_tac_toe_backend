const { z, email } = require("zod");

const registerValidation = z
  .object({
    name: z.string().min(3),
    email: z.email(),
    age: z.coerce.number("Age must be a number").min(18, "Age should be 18+"),
    password: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Password is required"
            : "Password must be a string",
      })
      .min(6, "Password must be of 6 character"),
    confirmPassword: z.string({
      error: (issue) =>
        issue.input === undefined
          ? "Confirm Password is required"
          : "Confirm Password must be a string",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirm password must be same",
    path: ["confirmPassword"],
  });
const updateValidation = z.object({
  name: z.string().min(3),
  age: z.coerce.number("Age must be a number").min(18, "Age should be 18+"),
});

const loginValidation = z.object({
  email: z.email({
    error: (issue) =>
      issue.input === undefined
        ? "Email is required"
        : "Email must be a valid email",
  }),
  password: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Password is required"
          : "Password must be a string",
    })
    .min(6, "Password must be of 6 character"),
});

module.exports = { registerValidation, updateValidation, loginValidation };
