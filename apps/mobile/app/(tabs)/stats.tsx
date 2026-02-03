import { View, Text, ScrollView, Dimensions } from 'react-native';
import { database } from '../../db';
import { HabitRepository, Habit } from '@repo/db';
import { withObservables } from '@nozbe/watermelondb/react';
import { clsx } from 'clsx';

const habitRepo = HabitRepository(database);

const StatCard = ({ title, value, icon, colorClass }: { title: string, value: string, icon: string, colorClass: string }) => (
  <View className="bg-surface rounded-xl p-4 border border-gray-800 flex-1 m-1">
    <View className="flex-row items-center gap-2 mb-1">
      <Text className="text-lg">{icon}</Text>
      <Text className="text-gray-400 text-xs">{title}</Text>
    </View>
    <Text className={clsx("text-xl font-bold", colorClass)}>{value}</Text>
  </View>
);

const HabitProgress = ({ title, current, best }: { title: string, current: number, best: number }) => {
  const percentage = best > 0 ? Math.min((current / best) * 100, 100) : 0;
  
  return (
    <View className="mb-4">
      <View className="flex-row justify-between mb-1">
        <Text className="text-gray-300 font-medium">{title}</Text>
        <Text className="text-gray-400 text-xs">{current} / {best} days</Text>
      </View>
      <View className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        <View 
          className="h-full bg-primary" 
          style={{ width: `${percentage}%` }}
        />
      </View>
    </View>
  );
};

const StatsContent = ({ habits }: { habits: Habit[] }) => {
  const totalHabits = habits.length;
  const totalStreaks = habits.reduce((sum, h) => sum + h.currentStreak, 0);
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.longestStreak), 0);
  const avgStreak = totalHabits > 0 ? Math.round(totalStreaks / totalHabits) : 0;

  return (
    <ScrollView className="flex-1 bg-background p-4" contentContainerStyle={{ paddingBottom: 40 }}>
      <Text className="text-white text-3xl font-bold mt-12 mb-6">Analytics</Text>

      <View className="flex-row justify-between mb-4">
        <StatCard title="Total" value={totalHabits.toString()} icon="📋" colorClass="text-blue-400" />
        <StatCard title="Streaks" value={totalStreaks.toString()} icon="🔥" colorClass="text-orange-400" />
      </View>
      <View className="flex-row justify-between mb-6">
        <StatCard title="Best" value={`${bestStreak}d`} icon="🏆" colorClass="text-yellow-400" />
        <StatCard title="Avg" value={`${avgStreak}d`} icon="📊" colorClass="text-green-400" />
      </View>

      <View className="bg-surface rounded-2xl p-6 border border-gray-800">
        <Text className="text-white text-xl font-bold mb-6">Habit Performance</Text>
        {habits.length === 0 ? (
          <Text className="text-gray-500 text-center py-10">No habit data available.</Text>
        ) : (
          habits.map((habit) => (
            <HabitProgress 
              key={habit.id} 
              title={habit.title} 
              current={habit.currentStreak} 
              best={habit.longestStreak} 
            />
          ))
        )}
      </View>
    </ScrollView>
  );
};

const EnhancedStats = withObservables([], () => ({
  habits: habitRepo.getAll().observe(),
}))(StatsContent);

export default function StatsScreen() {
  return (
    <View className="flex-1 bg-background">
      <EnhancedStats />
    </View>
  );
}
