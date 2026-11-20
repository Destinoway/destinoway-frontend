"use client";

import GiftCard from "./GiftCard";
import { useGiftcard } from "./hook/useGiftcard";

export default function GiftCardsSection() {
  const { data: giftCards = [] } = useGiftcard();

  return (
    <section className="background-color-bg  py-10 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-325 px-3 sm:px-4 md:px-3 lg:px-6">
        {giftCards.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 min-[700px]:grid-cols-3 sm:grid-cols-2 md:gap-3 lg:gap-6 xl:grid-cols-4">
            {giftCards.map((card) => (
              <GiftCard key={card._id} card={card} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-50 items-center justify-center">
            <p className="text-center text-base font-medium text-gray-500">
              Currently no gift cards
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
