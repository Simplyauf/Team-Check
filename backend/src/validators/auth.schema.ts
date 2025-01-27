const { z } = require("zod");

const registerSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    workspaceName: z
      .string()
      .min(2, "Workspace name must be at least 2 characters"),
    workspaceSubdomain: z
      .string()
      .min(3, "Subdomain must be at least 3 characters")
      .regex(
        /^[a-zA-Z0-9-]+$/,
        "Subdomain can only contain letters, numbers, and hyphens"
      ),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    workspaceId: z.string().uuid("Invalid workspace ID"),
  }),
});

module.exports = { registerSchema, loginSchema };
