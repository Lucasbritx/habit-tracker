import { View, Text, FlatList, Platform } from 'react-native';
import { database } from '../../db';
import { Habit, HabitRepository } from '@repo/db';
import { HabitItem } from '@repo/ui/habit-item';
import { useDateStore } from '@repo/ui/store';
import { Button } from '@repo/ui/button';
import { withObservables } from '@nozbe/watermelondb/react';
import * as Haptics from 'expo-haptics';
import { format } from 'date-fns';
import { router } from 'expo-router';

const habitRepo = HabitRepository(database);

const HabitList = ({ habits }: { habits: Habit[] }) => {
  const { selectedDate } = useDateStore();
  
  const handleToggle = async (habit: Habit) => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    await habitRepo.toggleComplete(habit.id, dateStr);
  };

  return (
    <FlatList
      data={habits}
      keyExtractor={item => item.id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <HabitItem
          title={item.title}
          streak={item.currentStreak}
          completed={false} // TODO: Implement day-specific status check
          onToggle={() => handleToggle(item)}
        />
      )}
      ListEmptyComponent={() => (
        <View className="items-center justify-center pt-20 gap-4">
            <Text className="text-gray-500 text-lg">No habits found.</Text>
            <Button onPress={() => router.push('/(tabs)/habits')}>
                Create Habit
            </Button>
        </View>
      )}
    />
  );
};

const EnhancedHabitList = withObservables([], () => ({
  habits: habitRepo.getAll(),
}))(HabitList);

export default function Home() {
  const { selectedDate } = useDateStore();

  return (
    <View className="flex-1 bg-background">
      <View className="pt-16 px-4 pb-4 bg-surface border-b border-gray-800">
        <Text className="text-primary text-3xl font-bold">
            {format(selectedDate, 'EEEE, MMM d')}
        </Text>
        <Text className="text-gray-400">Keep it up!</Text>
      </View>
      
      <EnhancedHabitList />
    </View>
  );
}
