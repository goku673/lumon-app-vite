import { useContext } from "react";
import { TabsContext } from "./tabsContext";

export function TabsContent({ value, children, className = "" }) {
  const { value: selectedValue } = useContext(TabsContext);
  const isActive = selectedValue === value;

  if (!isActive) return null;

  return (
    <div
      className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 ${className}`}
      data-state={isActive ? "active" : "inactive"}
    >
      {children}
    </div>
  );
}
