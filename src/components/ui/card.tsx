import type { ReactNode } from "react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";

// Compound component pattern: the parent <Card> owns the shell and
// the children are dedicated sub-parts that compose into the slot layout.
// Consumers don't have to remember a prop API; they assemble the card
// from its parts and the visual structure stays consistent.

interface CardProps {
  children: ReactNode;
  className?: string;
}

function CardRoot({ children, className }: CardProps) {
  return (
    <article
      className={cn(
        "block border bg-white rounded-lg overflow-hidden hover:shadow-sm transition",
        className,
      )}
    >
      {children}
    </article>
  );
}

interface CardLinkProps extends CardProps {
  to: string;
  ariaLabel?: string;
}

function CardLink({ children, className, to, ariaLabel }: CardLinkProps) {
  return (
    <Link
      to={to}
      aria-label={ariaLabel}
      className={cn(
        "block border bg-white rounded-lg overflow-hidden hover:shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900",
        className,
      )}
    >
      {children}
    </Link>
  );
}

interface CardImageProps {
  src: string | null;
  alt?: string;
  ratio?: "2/3" | "16/9" | "square";
  className?: string;
}

const ratioClass = {
  "2/3": "aspect-[2/3]",
  "16/9": "aspect-video",
  square: "aspect-square",
} as const;

function CardImage({ src, alt = "", ratio = "2/3", className }: CardImageProps) {
  return (
    <div
      className={cn("relative bg-neutral-200", ratioClass[ratio], className)}
    >
      {src && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}

function CardBody({ children, className }: CardProps) {
  return <div className={cn("p-3 space-y-1", className)}>{children}</div>;
}

function CardTitle({ children, className }: CardProps) {
  return (
    <p
      className={cn(
        "font-medium text-sm text-black leading-snug line-clamp-2",
        className,
      )}
    >
      {children}
    </p>
  );
}

function CardSubtitle({ children, className }: CardProps) {
  return (
    <p className={cn("text-xs text-neutral-500", className)}>{children}</p>
  );
}

function CardCorner({ children, className }: CardProps) {
  return (
    <div className={cn("absolute top-2 right-2", className)}>{children}</div>
  );
}

// Attach sub-parts as static properties on the root — this is what
// makes `<Card.Image>` / `<Card.Title>` etc. work and what gives the
// pattern its name. (See React docs: "Compound Components".)
export const Card = Object.assign(CardRoot, {
  Link: CardLink,
  Image: CardImage,
  Body: CardBody,
  Title: CardTitle,
  Subtitle: CardSubtitle,
  Corner: CardCorner,
});
