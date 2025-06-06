import { useContext } from "react";
import { TabsContext } from "./tabsContext";
import ButtonSE from "../../common/ButtonSE";

export function TabsTrigger({ value, children, className = "" }) {
  const { value: selectedValue, onValueChange } = useContext(TabsContext);
  const isActive = selectedValue === value;

  return (
    <ButtonSE
      variant={isActive ? "tabActive" : "tabInactive"}
      size="sm"
      className={`rounded-md ${className}`}
      onClick={() => onValueChange(value)}
    >
      {children}
    </ButtonSE>
  );
}
