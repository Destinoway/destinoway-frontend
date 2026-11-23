import dayjs from "dayjs";
import { z } from "zod";

export const profileSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "First name required")
      .max(50, "Maximum 50 characters allowed")
      .regex(/^[A-Za-z\s]+$/, "Only alphabets are allowed"),

    lastName: z
      .string()
      .trim()
      .max(50, "Maximum 50 characters allowed")
      .regex(/^[A-Za-z\s]*$/, "Only alphabets are allowed")
      .optional(),

    gender: z.enum(["Male", "Female", "Other"], {
      errorMap: () => ({
        message: "Please select valid gender",
      }),
    }),

    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Invalid email address"),

    mobile: z
      .string()
      .trim()
      .min(1, "Mobile number is required")
      .regex(/^[6-9]\d{9}$/, "Invalid mobile number"),

    nationality: z.string().min(1, "Nationality required"),

    state: z.string().min(1, "State required"),

    city: z.string().min(1, "City required"),

    maritalStatus: z.enum(["Single", "Married", "Divorced", "Widowed"], {
      errorMap: () => ({
        message: "Please select marital status",
      }),
    }),

    dateOfBirth: z
      .any()
      .nullable()
      .refine(
        (date) => {
          if (!date) return false;

          return dayjs(date).isBefore(dayjs(), "day");
        },
        {
          message: "Future date not allowed",
        },
      ),

    anniversary: z.any().nullable().optional(),
  })

  .refine(
    (data) => {
      if (data.maritalStatus === "Single") {
        return !data.anniversary;
      }

      return true;
    },
    {
      message: "Single person cannot add anniversary date",
      path: ["anniversary"],
    },
  )

  .refine(
    (data) => {
      if (!data.dateOfBirth || !data.anniversary) {
        return true;
      }

      return dayjs(data.anniversary).isAfter(dayjs(data.dateOfBirth), "day");
    },
    {
      message: "Anniversary cannot be before date of birth",
      path: ["anniversary"],
    },
  )

  .refine(
    (data) => {
      if (!data.anniversary) return true;

      return !dayjs(data.anniversary).isAfter(dayjs(), "day");
    },
    {
      message: "Anniversary cannot be in future",
      path: ["anniversary"],
    },
  );
