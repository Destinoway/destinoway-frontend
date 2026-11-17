// Shared shell for the hotel detail sections so they all share one look:
// icon tile + title/subtitle header, optional action, padded body.
export default function SectionCard({
  icon,
  title,
  subtitle,
  action,
  children,
  bodyClassName = "",
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          {icon && (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--theme-secondary)/8 text-[18px] text-(--theme-secondary)">
              {icon}
            </span>
          )}
          <div className="min-w-0">
            <h2 className="m-0 text-[17px] leading-snug font-bold text-(--theme-text-primary) sm:text-[19px]">
              {title}
            </h2>
            {subtitle && (
              <p className="m-0 mt-0.5 text-[12px] text-gray-500 sm:text-[13px]">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      <div className={`p-4 sm:p-6 ${bodyClassName}`}>{children}</div>
    </div>
  );
}
