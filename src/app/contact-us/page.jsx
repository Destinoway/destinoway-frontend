import CMSContentRenderer from "@/modules/cms/renderer/CMSContentRenderer";
import { fetchCmsBySlug } from "@/modules/cms/services/cmsFetch";
import NewsletterSection from "@/modules/shared/home/components/NewsletterSection";
import ContactFormSection from "@/modules/shared/pages/contact-us/contactcontant";
import ContactSection from "@/modules/shared/pages/contact-us/contacthero";
import ContactMapSection from "@/modules/shared/pages/contact-us/ContactMapSection";
import {
  buildPageTitle,
  getRobotsMetadata,
  getSiteUrl,
} from "@/modules/cms/utils/seoUrl";

export async function generateMetadata() {
  const contactUsCms = await fetchCmsBySlug("contact-us");

  const siteUrl = getSiteUrl();
  const title =
    contactUsCms?.metaTitle || "Contact Destinoway | Travel Booking Support";
  const description =
    contactUsCms?.metaDescription ||
    "Contact Destinoway for help with hotel bookings, travel services and customer support.";

  return {
    metadataBase: new URL(siteUrl),
    title: buildPageTitle(title),
    description,
    keywords: contactUsCms?.keywords,

    alternates: {
      canonical: `${siteUrl}/contact-us`,
    },

    robots: getRobotsMetadata(),

    openGraph: {
      title,
      description,
      url: `${siteUrl}/contact-us`,
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ContactSectionPages() {
  const contactUsCms = await fetchCmsBySlug("contact-us");

  const faqBlock = contactUsCms?.data?.blocks?.find(
    (block) => block.type === "faq",
  );

  const faqCms = faqBlock
    ? {
        ...contactUsCms,
        data: {
          ...contactUsCms.data,
          blocks: [faqBlock],
        },
      }
    : null;

  return (
    <>
      <ContactSection />

      <section className="bg-[#eef5fa] pt-21 lg:pt-28">
        {faqCms && <CMSContentRenderer cms={faqCms} />}
      </section>

      <ContactFormSection />
      <ContactMapSection />
      <NewsletterSection />
    </>
  );
}
