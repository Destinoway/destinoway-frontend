"use client";

import Image from "next/image";
import Link from "next/link";
import { footerData } from "./footerData";

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>

      <ul className="flex flex-wrap gap-x-2 gap-y-2 text-sm">
        {links.map((item, index) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="footer-hover-most-text-color relative inline-block transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[var(--theme-secondary)] after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.label}
              {index < links.length - 1 && ","}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const socialLinks = [
  {
    name: "Instagram",
    href: "#",
    icon: "/images/icons/instagram-logo.svg",
  },
  {
    name: "Facebook",
    href: "#",
    icon: "/images/icons/facebook-logo.svg",
  },
  {
    name: "LinkedIn",
    href: "#",
    icon: "/images/icons/linkedin-logo.svg",
  },
  {
    name: "WhatsApp",
    href: "#",
    icon: "/images/icons/whatsapp-logo.svg",
  },
];

export default function FooterLinks() {
  return (
    <div className="font-roboto! grid grid-cols-1 gap-10 text-white/90 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
      {/* About */}
      <div className="max-w-[340px]">
        <p className="footer-backgound-color text-[15px] leading-7 !text-white/90">
          PAN Journey helps travelers discover and book hotels with ease,
          offering secure payments, verified stays, and dedicated customer
          support.
        </p>

        {/* Contact */}
        <div className="footer-backgound-color mt-6 space-y-2 text-sm">
          <a
            href="mailto:support@panjourney.com"
            className="!most-text-color footer-hover-most-text-color block font-medium transition-colors"
          >
            support@panjourney.com
          </a>

          <a
            href="tel:+91 9876543210"
            className="!most-text-color footer-hover-most-text-color block font-medium transition-colors"
          >
            +91 9876543210
          </a>
        </div>

        {/* Trust badges */}
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="most-text-color rounded-full bg-[#eef5fa] px-3 py-1 text-xs font-medium">
            Secure Payments
          </span>

          <span className="most-text-color rounded-full bg-[#eef5fa] px-3 py-1 text-xs font-medium">
            24×7 Support
          </span>

          <span className="most-text-color rounded-full bg-[#eef5fa] px-3 py-1 text-xs font-medium">
            Verified Hotels
          </span>
        </div>

        {/* Small trust text */}
        <p className="footer-backgound-color mt-5 text-xs leading-6 !text-white/90">
          Trusted platform for discovering and booking hotels with a seamless
          and secure travel experience.
        </p>
      </div>

      {/* Company + Payment + Social */}
      <div>
        <FooterColumn title="Company" links={footerData.company} />

        {/* Payment */}
        <div className="mt-8">
          <h3 className="mb-4 text-lg font-semibold">Payment Methods</h3>

          <div className="flex flex-wrap items-center gap-1">
            <div className="relative h-7 w-14">
              <Image
                src="/images/payments/visa.svg"
                alt="Visa"
                fill
                className="object-contain"
              />
            </div>

            <div className="relative h-7 w-14">
              <Image
                src="/images/payments/mastercard.svg"
                alt="Mastercard"
                fill
                className="object-contain"
              />
            </div>

            <div className="relative h-7 w-14">
              <Image
                src="/images/payments/paypal.svg"
                alt="PayPal"
                fill
                className="object-contain"
              />
            </div>

            <div className="relative h-7 w-14">
              <Image
                src="/images/payments/upi.svg"
                alt="UPI"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Social */}
        <div className="mt-8">
          <h3 className="mb-4 text-lg font-semibold">Follow Us</h3>

          <div className="flex items-center gap-1">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-7 w-14 transition-all duration-300 hover:-translate-y-1 hover:scale-110"
              >
                <Image
                  src={item.icon}
                  alt={item.name}
                  fill
                  className="object-contain"
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Support + Legal */}
      <div>
        <FooterColumn title="Support" links={footerData.support} />

        <div className="mt-8">
          <FooterColumn title="Legal" links={footerData.legal} />
        </div>
      </div>

      {/* Explore */}
      <div>
        <FooterColumn title="Explore" links={footerData.explore} />
      </div>
    </div>
  );
}
