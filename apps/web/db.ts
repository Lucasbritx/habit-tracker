import { Database } from '@nozbe/watermelondb'
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'
import { schema, Habit, HabitLog, Category } from '@repo/db'

const adapter = new LokiJSAdapter({
  schema,
  // migrations,
  useWebWorker: false,
  useIncrementalIndexedDB: true,
  onSetUpError: (error) => {
    console.error('Database failed to load', error)
  }
})

export const database = new Database({
  adapter,
  modelClasses: [
    Habit,
    HabitLog,
    Category
  ],
})
