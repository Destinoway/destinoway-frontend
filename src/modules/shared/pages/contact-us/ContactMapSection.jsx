"use client";

import Image from "next/image";

export default function ContactMapSection() {
  return (
    <section className="bg-[#eef5fa] py-12 lg:py-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        {/* Heading */}
        <div className="mb-10 text-center">
          <h2 className="text-[28px] font-bold text-black md:text-[36px]">
            Visit Our Office
          </h2>

          <p className="mx-auto mt-3 max-w-[500px] text-[15px] text-gray-600">
            We'd love to hear from you. Reach out to us through any of the
            channels below or visit our office during business hours.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Office Details */}
          <div className="rounded-xl bg-white p-6 shadow-[0_8px_40px_rgba(0,0,0,0.08)] lg:p-8">
            <h3 className="most-text-color mb-3 text-[28px] font-bold">
              Need Immediate Assistance?
            </h3>

            <p className="mb-6 text-[15px] leading-relaxed text-gray-600">
              Our dedicated travel support team is available to assist you with
              bookings, cancellations, payment issues, refunds, and
              travel-related questions.
            </p>

            {/* Trust Points */}
            <div className="mb-8 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-[#f3f9fc] p-3 text-sm font-medium">
                ✓ 24/7 Online Support
              </div>

              <div className="rounded-lg bg-[#f3f9fc] p-3 text-sm font-medium">
                ✓ Secure Assistance
              </div>

              <div className="rounded-lg bg-[#f3f9fc] p-3 text-sm font-medium">
                ✓ Fast Response
              </div>

              <div className="rounded-lg bg-[#f3f9fc] p-3 text-sm font-medium">
                ✓ Trusted Travel Partner
              </div>
            </div>

            {/* Stats */}
            <div className="mb-8 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="most-text-color text-[24px] font-bold">24h</p>
                <p className="text-xs text-gray-500">Response Time</p>
              </div>

              <div>
                <p className="most-text-color text-[24px] font-bold">24/7</p>
                <p className="text-xs text-gray-500">Support</p>
              </div>

              <div>
                <p className="most-text-color text-[24px] font-bold">98%</p>
                <p className="text-xs text-gray-500">Satisfaction</p>
              </div>
            </div>

            {/* Contact Box */}
            <div className="rounded-lg border border-[#d8eaf0] bg-[#f9fcfd] p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Contact Info */}
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium text-gray-500">Phone:</span>{" "}
                    <a
                      href="tel:+919876543210"
                      className="font-semibold text-[#0f6b78]"
                    >
                      +91 98765 43210
                    </a>
                  </p>

                  <p>
                    <span className="font-medium text-gray-500">Email:</span>{" "}
                    <a
                      href="mailto:support@destinoway.com"
                      className="font-semibold text-[#0f6b78]"
                    >
                      support@destinoway.com
                    </a>
                  </p>
                </div>

                {/* Social Links */}
                <div className="sm:border-l sm:border-[#d8eaf0] sm:pl-4">
                  <p className="mb-3 text-sm font-semibold text-[#0f6b78]">
                    Follow Us
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href="https://instagram.com/destinoway"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-9 w-9 transform-gpu items-center justify-center rounded-full bg-white shadow-sm transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[3px] hover:shadow-lg"
                    >
                      <Image
                        src="/images/icons/instagram-logo.svg"
                        alt="Instagram"
                        width={20}
                        height={20}
                        className="transition-transform duration-300 ease-out group-hover:scale-110"
                      />
                    </a>

                    <a
                      href="https://facebook.com/destinoway"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-9 w-9 transform-gpu items-center justify-center rounded-full bg-white shadow-sm transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[3px] hover:shadow-lg"
                    >
                      <Image
                        src="/images/icons/facebook-logo.svg"
                        alt="Instagram"
                        width={20}
                        height={20}
                        className="transition-transform duration-300 ease-out group-hover:scale-110"
                      />
                    </a>

                    <a
                      href="https://www.linkedin.com/destinoway"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-9 w-9 transform-gpu items-center justify-center rounded-full bg-white shadow-sm transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[3px] hover:shadow-lg"
                    >
                      <Image
                        src="/images/icons/LinkedIn-logo.svg"
                        alt="Instagram"
                        width={20}
                        height={20}
                        className="transition-transform duration-300 ease-out group-hover:scale-110"
                      />
                    </a>

                    <a
                      href="https://www.whatsapp.com/destinoway"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-9 w-9 transform-gpu items-center justify-center rounded-full bg-white shadow-sm transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[3px] hover:shadow-lg"
                    >
                      <Image
                        src="/images/icons/whatsapp-logo.svg"
                        alt="Instagram"
                        width={20}
                        height={20}
                        className="transition-transform duration-300 ease-out group-hover:scale-110"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Google Map */}
          <div className="overflow-hidden rounded-xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
            <iframe
              title="PAN Journey Office Location"
              src="https://www.google.com/maps?q=Jaipur,Rajasthan,India&output=embed"
              width="100%"
              height="100%"
              className="min-h-[420px] border-0"
              loading="lazy"
              allowFullScreen
            />

            <div className="border-t border-gray-100 p-4">
              <a
                href="https://maps.google.com/?q=Jaipur,Rajasthan,India"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-md bg-[#0f6b78] px-4 py-2 text-sm font-medium text-white"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
