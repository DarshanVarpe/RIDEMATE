const { z } = require("zod");

const complaintSchema = z.object({
  subject: z.string().trim().min(1, "subject is required"), 
  description: z.string().trim().min(1, "description is required")
});

module.exports = {complaintSchema}