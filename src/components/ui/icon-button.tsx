import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Discriminated union props.
//
// `tone` decides the visual treatment, and the rest of the prop bag
// branches on the literal type of `tone`. TypeScript narrows each branch
// so the consumer can't, e.g., set `isActive` on the "neutral" tone or
// forget `isActive` on the "toggle" tone.

type ToggleProps = {
  tone: "toggle";
  /** Required when tone === "toggle". */
  isActive: boolean;
  /** Optional override; defaults to "Add to / Remove from list". */
  activeLabel?: string;
  inactiveLabel?: string;
};

type NeutralProps = {
  tone: "neutral";
  /** Required when tone === "neutral". */
  label: string;
};

type DangerProps = {
  tone: "danger";
  label: string;
};

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
} & (ToggleProps | NeutralProps | DangerProps);

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, className, ...rest }, ref) => {
    // Discriminate on `tone` to compute styling and accessible name.
    let toneClasses: string;
    let ariaLabel: string;
    let ariaPressed: boolean | undefined;

    switch (rest.tone) {
      case "toggle":
        toneClasses = rest.isActive
          ? "bg-amber-500 text-white hover:bg-amber-600"
          : "bg-white/90 text-neutral-700 hover:bg-white";
        ariaPressed = rest.isActive;
        ariaLabel = rest.isActive
          ? (rest.activeLabel ?? "Remove from watchlist")
          : (rest.inactiveLabel ?? "Add to watchlist");
        break;
      case "danger":
        toneClasses = "bg-red-500 text-white hover:bg-red-600";
        ariaLabel = rest.label;
        break;
      case "neutral":
        toneClasses =
          "bg-neutral-100 text-neutral-700 hover:bg-neutral-200";
        ariaLabel = rest.label;
        break;
    }

    // Strip discriminator-only props so they don't leak onto the DOM.
    const buttonProps: Record<string, unknown> = { ...rest };
    delete buttonProps.tone;
    delete buttonProps.isActive;
    delete buttonProps.activeLabel;
    delete buttonProps.inactiveLabel;
    delete buttonProps.label;

    return (
      <button
        ref={ref}
        type="button"
        aria-label={ariaLabel}
        aria-pressed={ariaPressed}
        className={cn(
          "inline-flex items-center justify-center rounded-full h-8 w-8 shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900",
          toneClasses,
          className,
        )}
        {...(buttonProps as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  },
);

IconButton.displayName = "IconButton";
