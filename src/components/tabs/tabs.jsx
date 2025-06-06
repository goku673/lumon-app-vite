import { useState } from "react";
import { TabsContext } from "./tabsContext";

export function Tabs({ defaultValue, value, onValueChange, children, className = "" }) {
  const [tabValue, setTabValue] = useState(defaultValue || value || "");

  const handleValueChange = (newValue) => {
    if (onValueChange) {
      onValueChange(newValue);
    } else {
      setTabValue(newValue);
    }
  };

  const contextValue = {
    value: value !== undefined ? value : tabValue,
    onValueChange: handleValueChange,
  };

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={`w-full ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
}
