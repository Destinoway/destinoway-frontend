"use client";

import RHFInput from "@/components/ui/RHFinputs/RHFInput";
import RHFTextarea from "@/components/ui/RHFinputs/RHFTextarea";

import RHFSelect from "@/components/ui/RHFinputs/RHFSelect";
import { useAuthModalStore } from "@/modules/auth/store/authModal.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { App } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import { useCreateContact } from "./hooks/useContact";
import { contactSchema } from "./schema/contactSchema";

export default function ContactFormSection() {
  const { message } = App.useApp();
  const methods = useForm({
    resolver: zodResolver(contactSchema),
    mode: "onSubmit",
    defaultValues: {
      category: "",
      BookingRefNo: "",
      fullName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const supportCategories = [
    { label: "Booking Issue", value: "Booking_Issue" },
    { label: "Refund Request", value: "Refund_request" },
    { label: "Payment Issue", value: "Payment_issue" },
    { label: "Hotel Complaint", value: "Hotel_Complaint" },
    { label: "Partnership / Business", value: "Partnership_Business" },
    { label: "General Query", value: "General_Query" },
  ];

  const { mutateAsync: createContact, isPending } = useCreateContact();
  const { openLoginModal } = useAuthModalStore();

  const onSubmit = async (data) => {
    try {
      const payload = {
        fullName: data.fullName,
        email: data.email,
        subject: data.subject,
        message: data.message,
        BookingRefNo: data.BookingRefNo,
        supportCategory: data.category,
      };

      const res = await createContact(payload);

      const ticketId = res?.data?.data?.ticketId;

      message.success({
        duration: 5,
        content: (
          <span>
            Your support request has been submitted successfully.
            <br />
            Please keep{" "}
            <strong className="text-[#006c7a]">
              Ticket ID: {ticketId}
            </strong>{" "}
            for future reference.
          </span>
        ),
      });

      methods.reset();
    } catch (error) {
      const status = error?.response?.status;
      const errorMessage = error?.response?.data?.message;

      // User not logged in
      if (status === 401 && errorMessage === "No token provided") {
        message.warning({
          key: "login-required",
          content: "Please login to continue.",
        });

        openLoginModal();
        return;
      }

      message.error(
        errorMessage || "Unable to submit your request. Please try again.",
      );
    }
  };
  return (
    <section className="font-roboto! bg-[#eef5fa] py-10 lg:py-10">
      <div className="mx-auto max-w-350 px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 min-[901px]:grid-cols-2 min-[901px]:gap-8">
          <div className="rounded bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] lg:p-8">
            <h2 className="mb-5 text-[18px] leading-[1.2] font-bold most-text-color sm:text-[18px] md:text-[28px] lg:text-[32px]">
              We&apos;re Always Here To
              <br />
              Help You
            </h2>

            <p className="mb-8 max-w-162.5 text-[15px] leading-[1.8] text-[#4B5563]">
              Our dedicated support team is available to assist you with hotel
              bookings, payment issues, cancellations, refunds, and
              travel-related inquiries. We strive to provide quick, reliable,
              and hassle-free assistance whenever you need it.
            </p>

            {/* Quick Stats */}
            <div className="mb-7 grid grid-cols-2 gap-5">
              <div className="rounded-lg border most-boder-colour p-3 pt-1 pb-0!">
                <p className="mb-2! text-[20px] font-bold most-text-color">
                  24/7
                </p>
                <p className="text-[13px] text-gray-600">Support Available</p>
              </div>

              <div className="rounded-lg border most-boder-colour p-3 pt-1 pb-0!">
                <p className="mb-2! text-[20px] font-bold most-text-color">
                  &lt; 24h
                </p>
                <p className="text-[13px] text-gray-600">Average Response</p>
              </div>
            </div>
            {/* Business Hours */}
            <h3 className="mb-6 text-[28px] font-semibold  md:text-[32px]">
              Business Hours
            </h3>

            <div className="space-y-5">
              <div className="flex justify-between border-b border-gray-300 pb-3">
                <span>Monday - Sunday</span>
                <span className="font-semibold">10 AM - 6 PM</span>
              </div>

              <div className="flex justify-between border-b border-gray-300 pb-3">
                <span>Online Support</span>
                <span className="font-semibold">24 Hours</span>
              </div>
            </div>

            {/* Quick Contact */}
            <div className="mt-10 rounded-xl border border-[#d7e8ee] bg-white p-5 shadow-sm">
              <h4 className="mb-3 text-lg font-semibold most-text-colour">
                Customer Support Commitment
              </h4>

              <p className="text-sm leading-relaxed text-gray-600">
                We strive to respond to all customer inquiries as quickly as
                possible and provide reliable assistance for bookings, payments,
                cancellations, and refunds.
              </p>
            </div>
          </div>

          {/* Right Form */}
          <div className="rounded-lg bg-white p-5 shadow-[0_8px_40px_rgba(0,0,0,0.12)] sm:p-4 md:p-5 lg:p-7">
            <div className="mb-8">
              <h3 className="text-[24px] font-bold text-black sm:text-[28px] md:text-[32px]">
                How Can We Help You?
              </h3>

              <p className="mt-2 text-[14px] leading-relaxed text-gray-500 md:text-[15px]">
                Select your query category and share the details below. Our
                support team will get back to you as soon as possible.
              </p>
            </div>
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Row 1 */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <RHFInput name="fullName" label="Full Name" placeholder=" " />

                  <RHFInput
                    name="email"
                    label="Email"
                    type="email"
                    placeholder=" "
                  />
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <RHFSelect
                    name="category"
                    label="Support Category"
                    options={supportCategories}
                  />
                  <RHFInput
                    name="BookingRefNo"
                    label="booking Refrence Id"
                    placeholder=" "
                  />
                </div>
                <RHFInput name="subject" label="Subject" placeholder=" " />

                {/* Message */}
                <RHFTextarea
                  name="message"
                  label="Message"
                  rows={5}
                  placeholder=" "
                />

                {/* Button */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-lg buttion-background-color px-8 py-3.5 font-medium text-white! transition-all duration-300 hover:-translate-y-px hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? "Submitting..." : "Submit"}
                </button>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </section>
  );
}
