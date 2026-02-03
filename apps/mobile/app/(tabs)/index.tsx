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

import { Q } from '@nozbe/watermelondb';

const habitRepo = HabitRepository(database);

interface HabitItemProps {
  habit: Habit;
  dateStr: string;
}

const HabitItemWrapper = withObservables(['habit', 'dateStr'], ({ habit, dateStr }: HabitItemProps) => ({
  habit: habit.observe(),
  isCompleted: habit.logs.query(Q.where('date', dateStr)).observe().map((logs: any[]) => logs.length > 0),
}))(({ habit, isCompleted, dateStr }: { habit: Habit; isCompleted: boolean; dateStr: string }) => {
  const handleToggle = async () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    await habitRepo.toggleComplete(habit.id, dateStr);
  };

  return (
    <HabitItem
      title={habit.title}
      streak={habit.currentStreak}
      completed={isCompleted}
      onToggle={handleToggle}
    />
  );
});

const HabitList = ({ habits, dateStr }: { habits: Habit[]; dateStr: string }) => {
  return (
    <FlatList
      data={habits}
      keyExtractor={item => item.id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <HabitItemWrapper habit={item} dateStr={dateStr} />
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

const EnhancedHabitList = withObservables(['dateStr'], ({ dateStr }: { dateStr: string }) => ({
  habits: habitRepo.getAll(),
}))(HabitList);

export default function Home() {
  const { selectedDate } = useDateStore();
  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  return (
    <View className="flex-1 bg-background">
      <View className="pt-16 px-4 pb-4 bg-surface border-b border-gray-800">
        <Text className="text-primary text-3xl font-bold">
            {format(selectedDate, 'EEEE, MMM d')}
        </Text>
        <Text className="text-gray-400">Keep it up!</Text>
      </View>
      
      <EnhancedHabitList dateStr={dateStr} />
    </View>
  );
}
