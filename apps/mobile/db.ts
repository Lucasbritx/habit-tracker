import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import { schema, Habit, HabitLog, Category } from '@repo/db'

const adapter = new SQLiteAdapter({
  schema,
  // (You might want to comment out migrations if you haven't created them yet)
  // migrations, 
  onSetUpError: error => {
    // Database failed to load -- offer the user to reload the app or log out
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
