import { Gamepad2, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

/** Finalized Sermo Play brand mark: a graduation cap interlinked with a game pad. */
export function BrandLogo({ className, size = "md" }: { className?: string; size?: "sm" | "md" }) {
  const box = size === "sm" ? "size-8" : "size-9";
  return (
    <span
      aria-hidden
      className={cn(
        "relative grid shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary ring-1 ring-primary/25",
        box,
        className,
      )}
    >
      <Gamepad2 className={size === "sm" ? "size-4" : "size-5"} />
      <GraduationCap className="absolute -right-1 -top-1 size-3.5 rounded-full bg-background p-[1px] text-primary" />
    </span>
  );
}
