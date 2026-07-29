import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type TypographyProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
};

function Text({
  as: Component = "p",
  children,
  className,
  typeClassName,
}: TypographyProps & { typeClassName: string }) {
  return (
    <Component className={cn(typeClassName, className)}>
      {children}
    </Component>
  );
}

export function Eyebrow(props: TypographyProps) {
  return <Text typeClassName="type-eyebrow" {...props} />;
}

export function HeroTitle(props: TypographyProps) {
  return <Text as="h1" typeClassName="type-hero" {...props} />;
}

export function PageTitle(props: TypographyProps) {
  return <Text as="h1" typeClassName="type-page-title" {...props} />;
}

export function SectionTitle(props: TypographyProps) {
  return <Text as="h2" typeClassName="type-section-title" {...props} />;
}

export function BodyText(props: TypographyProps) {
  return <Text typeClassName="type-body" {...props} />;
}

export function MutedText(props: TypographyProps) {
  return <Text typeClassName="type-muted" {...props} />;
}
