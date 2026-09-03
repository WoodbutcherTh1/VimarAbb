import { cn } from "@/lib/utils";

interface LogoProps {
  /** "dark" = for light backgrounds, "light" = for dark backgrounds. */
  variant?: "dark" | "light";
  className?: string;
}

export default function Logo({ variant = "dark", className }: LogoProps) {
  const plate =
    variant === "dark" ? "bg-navy-900" : "bg-white/10 ring-1 ring-white/25";

  return (
    <span className={cn("flex items-center gap-2.5 select-none", className)}>
      <span
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-lg",
          plate
        )}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M13.2 2.5 5.5 13.2h4.4L8.8 21.5l7.7-10.7h-4.4l1.1-8.3Z"
            fill={variant === "dark" ? "#fbbf24" : "#fbbf24"}
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[15px] font-extrabold tracking-tight",
            variant === "dark" ? "text-navy-900" : "text-white"
          )}
        >
          KAHANA
        </span>
        <span
          className={cn(
            "mt-0.5 text-[8.5px] font-semibold uppercase tracking-[0.32em]",
            variant === "dark" ? "text-muted" : "text-white/50"
          )}
        >
          Electrical
        </span>
      </span>
    </span>
  );
}