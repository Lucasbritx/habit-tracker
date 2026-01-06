import { Database } from '@nozbe/watermelondb'
import { Habit } from '../index'

// We pass the database instance because it differs between Web and Mobile
export const HabitRepository = (database: Database) => {
  const habitsCollection = database.get<Habit>('habits')

  const create = async (title: string, categoryId: string, frequency: 'daily' | 'weekly' = 'daily') => {
    return await database.write(async () => {
      return await habitsCollection.create(habit => {
        habit.title = title
        habit.categoryId = categoryId
        habit.frequency = frequency
        habit.targetCount = 1
        habit.currentStreak = 0
        habit.longestStreak = 0
      })
    })
  }

  const getAll = () => {
    return habitsCollection.query()
  }

  return {
    create,
    getAll,
  }
}
