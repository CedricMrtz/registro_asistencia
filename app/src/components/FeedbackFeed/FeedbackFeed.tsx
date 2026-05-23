"use client";

import { AssistanceFeedback } from "@/types/assistance.types";
import { FeedbackCard } from "@/components/FeedbackCard";

interface FeedbackFeedProps {
  items: AssistanceFeedback[];
}

export function FeedbackFeed({ items }: FeedbackFeedProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-6 text-sm text-stone-500">
        Aun no hay registros en esta sesion.
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
      {items.map((item, index) => (
        <FeedbackCard key={`${item.matricula}-${index}`} item={item} />
      ))}
    </div>
  );
}
