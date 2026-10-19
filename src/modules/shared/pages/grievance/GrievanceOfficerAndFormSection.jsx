"use client";

import RHFInput from "@/components/ui/RHFinputs/RHFInput";
import RHFSelect from "@/components/ui/RHFinputs/RHFSelect";
import RHFTextarea from "@/components/ui/RHFinputs/RHFTextarea";
import { useAuthModalStore } from "@/modules/auth/store/authModal.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { message } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import { useCreateGrievance } from "./hooks/useGrievance";
import { grievanceSchema } from "./schema/grievanceSchema";

const grievanceCategories = [
  {
    label: "Refund Issue",
    value: "refund_request",
  },
  {
    label: "Booking Issue",
    value: "booking_issue",
  },
  {
    label: "Payment Dispute",
    value: "payment_issue",
  },
  {
    label: "Hotel Complaint",
    value: "hotel_complaint",
  },
  {
    label: "General Query",
    value: "general_query",
  },
  {
    label: "Partnership Business",
    value: "partnership_business",
  },
];

export default function GrievanceOfficerAndFormSection() {
  const methods = useForm({
    resolver: zodResolver(grievanceSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      bookingRefNo: "",
      supportTicketId: "",
      category: "",
      subject: "",
      description: "",
    },
  });

  const { mutateAsync: createGrievance, isPending } = useCreateGrievance();

  const { openLoginModal } = useAuthModalStore();

  const onSubmit = async (data) => {
    try {
      const payload = {
        fullName: data.fullName,
        email: data.email,
        subject: data.subject,
        bookingRefId: data.bookingRefNo,
        message: data.description,
        ticketId: data.supportTicketId,
        supportCategory: data.category,
      };

      const res = await createGrievance(payload);

      const grievanceId = res?.data?.data?.grievanceId || "PAN-CS-000003";

      message.success({
        duration: 5,
        content: (
          <span>
            Your grievance has been submitted successfully.
            <br />
            Please keep{" "}
            <strong className="text-[#006c7a]">
              Reference ID: {grievanceId}
            </strong>{" "}
            for future reference.
          </span>
        ),
      });

      methods.reset();
    } catch (error) {
      const status = error?.response?.status;
      const errorMessage = error?.response?.data?.message;

      if (status === 401 && errorMessage === "No token provided") {
        message.warning({
          key: "login-required",
          content: "Please login to continue.",
        });

        openLoginModal();
        return;
      }

      message.error(
        errorMessage || "Unable to submit your grievance. Please try again.",
      );
    }
  };

  const onError = (errors) => {
    console.log("ERRORS", errors);
    console.log("isSubmitted", methods.formState.isSubmitted);
  };
  console.log("FORM ERRORS", methods.formState.errors);
  return (
    <section className="bg-[#eef5fa] py-12 lg:py-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr] lg:gap-8">
          <div className="rounded bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] lg:p-8">
            <div className="mb-6">
              <span className="most-text-color rounded-full bg-[#eef5fa] px-3 py-1 text-xs font-medium">
                Customer Protection
              </span>
            </div>

            <h2 className="most-text-color mb-3 text-[28px] font-bold">
              Grievance Officer
            </h2>

            <p className="mb-6 text-[15px] leading-relaxed text-gray-600">
              If your issue has not been resolved through our customer support
              team, you may escalate it to our Grievance Officer for an
              independent review.
            </p>

            <div className="mb-1 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-[#eef5fa] px-5 py-2">
                <p className="text-[11px] text-gray-500">Review Time</p>
                <p className="most-text-color mt-0.5 text-[18px] font-bold">
                  48 Hours
                </p>
              </div>

              <div className="rounded-lg bg-[#eef5fa] px-5 py-2">
                <p className="text-[11px] text-gray-500">Resolution</p>
                <p className="most-text-color mt-0.5 text-[18px] font-bold">
                  7 Days
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 sm:grid-cols-2">
              <div className="rounded-lg border border-[#dcecf1] bg-[#f8fcfd] px-4 py-3">
                <p className="text-[11px] font-medium tracking-wide text-gray-500 uppercase">
                  Grievance Email
                </p>

                <a
                  href="mailto:grievance@destinoway.com"
                  className="mt-1 block text-[14px] font-semibold text-[#0f6b78] hover:underline"
                >
                  grievance@destinoway.com
                </a>
              </div>

              <div className="rounded-lg border border-[#dcecf1] bg-[#f8fcfd] px-4 py-3">
                <p className="text-[11px] font-medium tracking-wide text-gray-500 uppercase">
                  Contact Number
                </p>

                <a
                  href="tel:+919876543210"
                  className="mt-1 block text-[14px] font-semibold text-[#0f6b78] hover:underline"
                >
                  +91 9876543210
                </a>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-[#dcecf1] bg-[#f8fcfd] p-4">
              <p className="most-text-color font-medium">
                Before Raising A Grievance
              </p>

              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>✓ Contact customer support first</li>
                <li>✓ Keep booking reference ready</li>
                <li>✓ Mention previous ticket number</li>
                <li>✓ Provide complete issue details</li>
                <li>✓ Attach supporting evidence if available</li>
              </ul>
            </div>
            <div className="mt-4 rounded-xl border border-[#f7d9b5] bg-[#fff8ef] p-4">
              <h4 className="mb-2 font-semibold text-[#b76e00]">
                Important Notice
              </h4>

              <p className="text-sm leading-relaxed text-gray-700">
                Please raise a grievance only after contacting our support team
                and allowing reasonable time for resolution. Grievances are
                intended for unresolved or escalated matters.
              </p>
            </div>
          </div>

          <div className="rounded bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] lg:p-8">
            <h3 className="mb-2 text-[28px] font-bold text-black">
              Submit Your Grievance
            </h3>

            <p className="mb-8 text-sm text-gray-500">
              Share complete details regarding your concern. Our grievance team
              will review your request and provide updates throughout the
              resolution process.
            </p>

            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit, onError)}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <RHFInput name="fullName" label="Full Name" placeholder=" " />

                  <RHFInput
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder=" "
                  />

                  <RHFInput name="phone" label="Phone Number" placeholder=" " />

                  <RHFSelect
                    name="category"
                    label="Issue Category"
                    options={grievanceCategories}
                  />

                  <RHFInput
                    name="bookingRefNo"
                    label="Booking Reference Number"
                    placeholder=" "
                  />

                  <RHFInput
                    name="supportTicketId"
                    label="Support Ticket ID"
                    placeholder=" "
                  />
                </div>

                <RHFInput name="subject" label="Subject" placeholder=" " />

                <RHFTextarea
                  name="description"
                  label="Detailed Description"
                  rows={5}
                  placeholder=" "
                />

                <div className="rounded-lg bg-[#eef5fa] p-4">
                  <p className="text-xs leading-relaxed text-gray-600">
                    Please provide accurate information and include any previous
                    support ticket details to help us review your grievance
                    faster.
                  </p>
                </div>

                <button
                  type="submit"
                  className="buttion-background-color w-full rounded-lg px-8 py-3.5 font-medium text-white! transition-all duration-300 hover:shadow-lg"
                >
                  Submit Grievance
                </button>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </section>
  );
}
