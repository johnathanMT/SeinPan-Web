import { Tv } from "lucide-react";

/** The terracotta TV tile beside the shop name (header and footer). */
export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-theme-color-3 shadow-md shadow-theme-color-4/20 ${className}`}>
      <Tv size={18} className="text-white" aria-hidden="true" />
    </span>
  );
}
