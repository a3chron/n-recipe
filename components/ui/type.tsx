import { Text, View } from "react-native";

export default function RecipeType({
  name,
  icon,
}: {
  name: string;
  icon: React.ReactNode;
}) {
  return (
    <View className="flex items-center justify-center gap-2 bg-red-950/20 text-red-50 p-4 rounded-2xl border-2 border-red-600 w-32">
      {icon}
      <Text className="text-red-50">{name}</Text>
    </View>
  );
}
