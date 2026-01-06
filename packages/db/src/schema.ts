import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'habits',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'category_id', type: 'string', isIndexed: true },
        { name: 'frequency', type: 'string' }, // 'daily', 'weekly', 'custom'
        { name: 'target_count', type: 'number' }, // e.g. 1 time per day, 3 times per week
        { name: 'current_streak', type: 'number' },
        { name: 'longest_streak', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'habit_logs', // Records of completions
      columns: [
        { name: 'habit_id', type: 'string', isIndexed: true },
        { name: 'date', type: 'string', isIndexed: true }, // YYYY-MM-DD
        { name: 'count', type: 'number' }, // How many times done this day
        { name: 'created_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'categories',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'color', type: 'string' },
        { name: 'icon', type: 'string' },
      ]
    }),
  ]
})
