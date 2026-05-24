import {
  createContext,
  useContext,
  useId,
  useMemo,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

// Compound component pattern with implicit context. <Tabs> owns the
// "which tab is selected" state via a controlled prop; the child parts
// (TabList / Tab / TabPanel) read from context so consumers don't have
// to thread props through every level.

interface TabsContextValue<V extends string = string> {
  value: V;
  onChange: (next: V) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error("Tabs sub-components must be used inside <Tabs>");
  }
  return ctx;
}

interface TabsProps<V extends string> {
  value: V;
  onValueChange: (next: V) => void;
  children: ReactNode;
  className?: string;
}

function TabsRoot<V extends string>({
  value,
  onValueChange,
  children,
  className,
}: TabsProps<V>) {
  const baseId = useId();
  const ctx = useMemo<TabsContextValue<V>>(
    () => ({ value, onChange: onValueChange, baseId }),
    [value, onValueChange, baseId],
  );

  return (
    <TabsContext.Provider value={ctx as unknown as TabsContextValue}>
      <div className={cn("space-y-4", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-neutral-100 p-1",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface TabProps {
  value: string;
  children: ReactNode;
}

function Tab({ value, children }: TabProps) {
  const ctx = useTabsContext();
  const isActive = ctx.value === value;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={`${ctx.baseId}-panel-${value}`}
      id={`${ctx.baseId}-tab-${value}`}
      onClick={() => ctx.onChange(value)}
      className={cn(
        "px-4 py-1.5 rounded-full text-sm font-medium transition",
        isActive
          ? "bg-white text-neutral-900 shadow-sm"
          : "hover:text-neutral-900",
      )}
    >
      {children}
    </button>
  );
}

interface TabPanelProps {
  value: string;
  children: ReactNode;
  /**
   * When `true`, the panel stays in the DOM tree even when not the active tab.
   * Used together with React 19.2's <Activity> so a parent can keep both panels
   * mounted and preserve state across tab switches.
   */
  keepMounted?: boolean;
}

function TabPanel({ value, children, keepMounted = false }: TabPanelProps) {
  const ctx = useTabsContext();
  const isActive = ctx.value === value;
  if (!isActive && !keepMounted) return null;
  return (
    <div
      role="tabpanel"
      id={`${ctx.baseId}-panel-${value}`}
      aria-labelledby={`${ctx.baseId}-tab-${value}`}
      hidden={!isActive}
    >
      {children}
    </div>
  );
}

export const Tabs = Object.assign(TabsRoot, {
  List: TabList,
  Tab,
  Panel: TabPanel,
});
