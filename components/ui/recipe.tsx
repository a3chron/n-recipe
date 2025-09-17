import { Image } from "expo-image";
import { Pizza } from "lucide-react-native";
import { Text, View } from "react-native";

export default function Recipe({ name, img }: { name: string; img?: string }) {
  return (
    <View className="flex items-center justify-center bg-black gap-2 p-6 rounded-2xl w-full">
      {img === undefined ? (
        <Pizza size={44} color="#C44" />
      ) : (
        <Image source={img} />
      )}
      <Text className="text-red-50">{name}</Text>
    </View>
  );
}
