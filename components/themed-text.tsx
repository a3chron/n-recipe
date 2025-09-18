import { useAccentColors } from "@/hooks/use-system-accent";
import { cn } from "@/lib/utils";
import { Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  className?: string;
  type?: "default" | "title" | "bold" | "subtitle" | "link" | "button";
};

export function ThemedText({
  lightColor,
  darkColor,
  className,
  type = "default",
  ...otherProps
}: ThemedTextProps) {
  const accentColors = useAccentColors();
    
  const typeClasses = {
    default: '',
    title: 'text-3xl font-bold',
    bold: 'font-semibold',
    subtitle: 'text-xl font-medium',
    link: 'underline',
    button: '',
  };

  const typeTextColors = {
    default: accentColors.subtext1,
    title: accentColors.text,
    bold: accentColors.subtext1,
    subtitle: accentColors.text,
    link: accentColors.primary,
    button: accentColors.crust,
  };
  
  return (
    <Text 
      style={{color: typeTextColors[type]}}
      className={cn(typeClasses[type], className)}
      {...otherProps} 
    />
  );
}