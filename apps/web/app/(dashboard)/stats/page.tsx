"use client";

import { useHabits } from "../../../lib/habit-store";

export default function StatsPage() {
  const habits = useHabits();

  const totalHabits = habits.length;
  const totalStreaks = habits.reduce((sum, h) => sum + h.currentStreak, 0);
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.longestStreak), 0);
  const avgStreak = totalHabits > 0 ? Math.round(totalStreaks / totalHabits) : 0;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-white">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Habits" value={totalHabits.toString()} icon="📋" color="text-blue-400" />
        <StatCard title="Active Streaks" value={totalStreaks.toString()} icon="🔥" color="text-orange-400" />
        <StatCard title="Best Streak" value={`${bestStreak} days`} icon="🏆" color="text-yellow-400" />
        <StatCard title="Avg Streak" value={`${avgStreak} days`} icon="📊" color="text-green-400" />
      </div>

      {habits.length === 0 ? (
        <div className="bg-surface rounded-xl p-8 border border-gray-800 text-center">
          <p className="text-gray-400">Create some habits to see your statistics!</p>
        </div>
      ) : (
        <div className="bg-surface rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">Habit Performance</h2>
          <div className="space-y-4">
            {habits.map((habit) => (
              <HabitProgress 
                key={habit.id} 
                title={habit.title} 
                current={habit.currentStreak} 
                best={habit.longestStreak} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: string; icon: string; color: string }) {
  return (
    <div className="bg-surface rounded-xl p-6 border border-gray-800">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <p className="text-gray-400 text-sm">{title}</p>
      </div>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function HabitProgress({ title, current, best }: { title: string; current: number; best: number }) {
  const percentage = best > 0 ? Math.round((current / best) * 100) : 0;
  
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-gray-300">{title}</span>
        <span className="text-gray-400 text-sm">{current} / {best} days</span>
      </div>
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-500"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}
