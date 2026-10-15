import { z } from "zod";

const guestFieldsSchema = z.object({
  title: z.string().min(1, "Select gender"),
  firstName: z.string().trim().min(2, "First name required"),
  lastName: z.string().trim().optional(),
});

export const primaryGuestSchema = z.object({
  bookingFor: z.string(),
  customerAddress: z.string().trim().min(2, "Address required"),
  customerState: z.string().trim().min(2, "State required"),
  customerCity: z.string().trim().min(2, "City required"),
  customerPostalCode: z
    .string()
    .trim()
    .regex(/^[0-9]{6}$/, "Enter valid postal code"),

  panNumber: z.string().trim().optional(),
  customerEmail: z.string().trim().email("Enter valid email"),
  customerMobile: z.string().regex(/^[0-9]{10}$/, "Enter valid mobile"),
  customerPhoneCode: z.string().optional(),
  paxDetails: z.record(guestFieldsSchema),
});

export const guestSchema = guestFieldsSchema.extend({
  isChild: z.boolean().optional(),
});
