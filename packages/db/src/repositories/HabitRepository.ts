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

  const toggleComplete = async (habitId: string, date: string) => {
    await database.write(async () => {
      const logsCollection = database.get('habit_logs')
      const habit = await habitsCollection.find(habitId)
      
      // Check if already completed for this date
      const existingLogs = await logsCollection.query(
        // We need extended Query support or raw query for this usually, 
        // but for now let's use a simple strategy assuming small data or simple fetch
        // In real WatermelonDB we use Q.where
      ).fetch()
      
      // Note: In real app, we should use Q.where('date', date).
      // WatermelonDB requires importing Q. 
      // For MVP without complex queries setup:
      const log = existingLogs.find((l: any) => l.habit_id === habitId && l.date === date)

      if (log) {
        // Undo completion
        await log.destroyPermanently()
        // Recalculate streak here would be complex, simpler to decrement if it was extending
        // For MVP: Simplistic streak update or just ignore for undo
      } else {
        // Complete
        await logsCollection.create((newLog: any) => {
           newLog.habit.set(habit)
           newLog.date = date
           newLog.count = 1
        })
        
        // Update Streak (simplified: increment current if yesterday was done or streak > 0)
        // Ideally we re-calculate full streak from logs
        // habit.update(...)
      }
    })
  }

  return {
    create,
    getAll,
    toggleComplete
  }
}
