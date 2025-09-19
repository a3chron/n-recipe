import { useAccentColors } from "@/hooks/use-system-accent";
import { View, type ViewProps } from "react-native";

export type ThemedViewProps = ViewProps & {
  className?: string;
  type?: "bg" | "modal" | "button";
};

export function ThemedView({
  className,
  type = "bg",
  ...otherProps
}: ThemedViewProps) {
  const accentColors = useAccentColors();

  const typeBgColor = {
    bg: accentColors.base,
    modal: accentColors.mantle,
    button: accentColors.crust,
  };

  return (
    <View
      style={{ backgroundColor: typeBgColor[type] }}
      className={className}
      {...otherProps}
    />
  );
}
