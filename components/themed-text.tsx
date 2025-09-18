import { cn } from "@/lib/utils";
import { Text, useColorScheme, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  className?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  className,
  type = "default",
  ...otherProps
}: ThemedTextProps) {
  const colorScheme = useColorScheme();
  
  const baseClasses = colorScheme === 'dark' 
    ? 'text-neutral-100' 
    : 'text-neutral-900';
    
  const typeClasses = {
    default: '',
    title: 'text-3xl font-bold',
    defaultSemiBold: 'font-semibold',
    subtitle: 'text-xl font-medium',
    link: 'text-blue-500 underline'
  };
  
  return (
    <Text 
      style={style}
      className={cn(baseClasses, typeClasses[type], className)}
      {...otherProps} 
    />
  );
}