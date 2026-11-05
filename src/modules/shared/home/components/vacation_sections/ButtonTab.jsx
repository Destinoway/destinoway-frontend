"use client";

export default function ButtonTab({ tabs = [], activeTab, setActiveTab }) {
  return (
    <div className="scrollbar-hide w-full overflow-x-auto border-0 border-b-0">
      <div className="flex min-w-max justify-start gap-4 sm:justify-center sm:gap-6 md:gap-8">
        {tabs.map((tab) => (
          <button
            key={tab._id}
            onClick={() => setActiveTab(tab.category)}
            className={`relative border-0 border-b-0 bg-transparent pb-4 text-[15px]! font-medium whitespace-nowrap shadow-none transition-all duration-200 outline-none focus:ring-0 focus:outline-none sm:text-[21px]! md:text-[18px]! lg:text-[21px]! ${
              activeTab === tab.category
                ? "teb-text-color"
                : "hover:teb-text-color text-gray-900!"
            }`}
          >
            {tab.category}

            {/* ONLY active underline */}
            {activeTab === tab.category && (
              <span className="teb-boder-colour absolute bottom-1 left-0 h-1! w-full rounded-full shadow-[0_4px_6px_var(--teb-shadow)] sm:h-0.5" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
