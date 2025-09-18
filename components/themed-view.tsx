import { cn } from "@/lib/utils";
import { useColorScheme, View, type ViewProps } from "react-native";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  className?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  className,
  ...otherProps
}: ThemedViewProps) {
  const colorScheme = useColorScheme();
  
  const baseClasses = colorScheme === 'dark' 
    ? 'bg-neutral-900' 
    : 'bg-white';
  
  return (
    <View 
      style={style} 
      className={cn(baseClasses, className)} 
      {...otherProps} 
    />
  );
}
