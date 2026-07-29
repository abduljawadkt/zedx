import { cn } from "@/lib/utils";

export function Button({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex h-12 items-center justify-center rounded-full bg-[#00a0e3] px-5 type-control text-white transition hover:bg-[#008fcb] active:scale-95",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
