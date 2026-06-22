import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
}

export function SectionHeading({
  label,
  title,
  description,
  align = "left",
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-12 max-w-2xl lg:mb-16",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {label && <p className="label-xs mb-4">{label}</p>}
      <h2 className={cn("headline-lg text-balance", titleClassName)}>{title}</h2>
      {description && <p className="body-lg mt-5">{description}</p>}
    </div>
  );
}
