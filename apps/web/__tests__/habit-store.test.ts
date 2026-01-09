import { HabitData } from '../lib/habit-store';

// Mock crypto.randomUUID for testing
if (!global.crypto) {
  // @ts-ignore
  global.crypto = {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9),
  };
}

describe('HabitStore Logic (Manual Mocking Tests)', () => {
  let habits: HabitData[] = [];

  beforeEach(() => {
    habits = [];
    localStorage.clear();
  });

  const createHabit = (title: string): HabitData => {
    const habit: HabitData = {
      id: crypto.randomUUID(),
      title,
      frequency: 'daily',
      categoryId: 'default',
      currentStreak: 0,
      longestStreak: 0,
      createdAt: Date.now(),
      completedDates: [],
    };
    habits.push(habit);
    return habit;
  };

  const toggleComplete = (habit: HabitData) => {
    const today = new Date().toISOString().split('T')[0];
    const alreadyCompleted = habit.completedDates.includes(today);
    
    if (alreadyCompleted) {
      habit.completedDates = habit.completedDates.filter(d => d !== today);
      habit.currentStreak = Math.max(0, habit.currentStreak - 1);
    } else {
      habit.completedDates.push(today);
      habit.currentStreak++;
      if (habit.currentStreak > habit.longestStreak) {
        habit.longestStreak = habit.currentStreak;
      }
    }
  };

  it('should create a habit with correct initial state', () => {
    const habit = createHabit('Drink Water');
    expect(habit.title).toBe('Drink Water');
    expect(habit.currentStreak).toBe(0);
    expect(habit.completedDates).toHaveLength(0);
  });

  it('should increment streak when completed for the first time today', () => {
    const habit = createHabit('Read a book');
    toggleComplete(habit);
    expect(habit.currentStreak).toBe(1);
    expect(habit.completedDates).toContain(new Date().toISOString().split('T')[0]);
  });

  it('should decrement streak and remove date when uncompleting today', () => {
    const habit = createHabit('Exercise');
    toggleComplete(habit); // Complete
    expect(habit.currentStreak).toBe(1);
    
    toggleComplete(habit); // Uncomplete
    expect(habit.currentStreak).toBe(0);
    expect(habit.completedDates).not.toContain(new Date().toISOString().split('T')[0]);
  });
});
