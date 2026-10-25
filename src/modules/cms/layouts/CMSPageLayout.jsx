export default function CMSPageLayout({ children, cms }) {
  const blocks = cms?.data?.blocks || [];

  // The first hero with a title renders the page H1; otherwise the layout supplies it.
  const hasHero = blocks?.some((b) => b?.type === "hero" && b?.data?.title);

  return (
    <div
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {!hasHero && (
        <section
          style={{
            background: "linear-gradient(135deg,#0f172a,#1e293b)",
            color: "#fff",
            padding: "70px 20px",
            textAlign: "center",
          }}
        >
          <div className="container">
            <h1
              style={{
                fontSize: 44,
                fontWeight: 700,
                marginBottom: 12,
              }}
            >
              {cms?.title}
            </h1>

            <p
              style={{
                opacity: 0.85,
                maxWidth: 700,
                margin: "0 auto",
              }}
            >
              {cms?.metaDescription}
            </p>
          </div>
        </section>
      )}

      <div
        style={{
          paddingBottom: 80,
        }}
      >
        {children}
      </div>
    </div>
  );
}
