import { View, Text } from 'react-native';
import { Button } from '@repo/ui/button';

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-background gap-4">
      <Text className="text-primary text-2xl font-bold">Habit Tracker Mobile</Text>
      <Text className="text-secondary text-lg">Shared UI Test</Text>
      
      <Button variant="primary" onPress={() => alert("Mobile Primary")}>
        Touch Me
      </Button>
      
      <Button variant="secondary" onPress={() => alert("Mobile Secondary")}>
        Secondary
      </Button>
    </View>
  );
}
