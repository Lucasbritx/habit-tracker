import { render, screen } from '@testing-library/react';
import Home from '../app/(dashboard)/page';
import { HabitStoreProvider } from '../lib/habit-store';

// Minimal mock for habit-store
jest.mock('../lib/habit-store', () => {
  const original = jest.requireActual('../lib/habit-store');
  return {
    ...original,
    useHabits: () => [
      {
        id: '1',
        title: 'Test Habit',
        frequency: 'daily',
        currentStreak: 5,
        longestStreak: 10,
        completedDates: [],
      }
    ],
    useHabitStore: () => ({
      isCompletedToday: () => false,
      toggleComplete: jest.fn(),
    }),
  };
});

describe('Home Page', () => {
  it('renders progress and habit list', () => {
    render(
      <HabitStoreProvider>
        <Home />
      </HabitStoreProvider>
    );

    expect(screen.getByText("Today's Habits")).toBeInTheDocument();
    expect(screen.getByText("Test Habit")).toBeInTheDocument();
    expect(screen.getByText("🔥 5 day streak")).toBeInTheDocument();
  });
});
