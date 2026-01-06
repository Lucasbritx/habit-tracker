import { View, Text, Vibration, Platform } from 'react-native';
import { Button } from '@repo/ui/button';
import * as Haptics from 'expo-haptics';
import { Confetti } from '@repo/ui/confetti';
import { useState } from 'react';

export default function Home() {
  const [showConfetti, setShowConfetti] = useState(false);

  const handleComplete = () => {
    // 1. Trigger Haptics (Mobile only)
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    // 2. Show Confetti (Web mainly, mobile needs native lib)
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  return (
    <View className="flex-1 items-center justify-center bg-background gap-4">
      <Confetti trigger={showConfetti} />
      
      <Text className="text-primary text-2xl font-bold">Habit Tracker Mobile</Text>
      
      <Button variant="primary" onPress={handleComplete}>
        Complete Habit!
      </Button>
    </View>
  );
}
