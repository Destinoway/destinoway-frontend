import DOMPurify from "isomorphic-dompurify";

export default function RoomDescription({ html, className = "", contentRef }) {
  const content = DOMPurify.sanitize(typeof html === "string" ? html : "");

  if (!content) {
    return null;
  }

  return (
    <div
      ref={contentRef}
      className={`text-sm leading-6 text-slate-600 [&_h1]:my-3 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:my-3 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:my-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h4]:my-2 [&_h4]:text-base [&_h4]:font-semibold [&_h5]:my-2 [&_h5]:text-sm [&_h5]:font-semibold [&_h6]:my-2 [&_h6]:text-xs [&_h6]:font-semibold [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-1 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
