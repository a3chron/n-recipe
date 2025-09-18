// components/ui/type.tsx
import { useAccentClasses } from "@/hooks/use-system-accent";
import { Text, TouchableOpacity } from "react-native";

export default function RecipeType({
  name,
  icon,
  onPress,
}: {
  name: string;
  icon: React.ReactNode;
  onPress?: () => void;
}) {
  const accentClasses = useAccentClasses();
  
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="flex items-center justify-center gap-2 p-4 rounded-2xl border-2 w-32"
      style={{backgroundColor: `${accentClasses.tertiary}20`, borderColor: accentClasses.primary}}
      activeOpacity={0.8}
    >
      {icon}
      <Text className="font-medium capitalize" style={{color: accentClasses.primary}}>
        {name}
      </Text>
    </TouchableOpacity>
  );
}
