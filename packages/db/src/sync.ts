import { synchronize, SyncDatabaseChangeSet } from '@nozbe/watermelondb/sync'
import { Database } from '@nozbe/watermelondb'

export async function sync(database: Database, supabase: any) {
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt }) => {
      const { data: habits, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .gt('updated_at', lastPulledAt ? new Date(lastPulledAt).toISOString() : new Date(0).toISOString())

      if (habitsError) throw habitsError

      const { data: logs, error: logsError } = await supabase
        .from('habit_logs')
        .select('*')
        .gt('created_at', lastPulledAt ? new Date(lastPulledAt).toISOString() : new Date(0).toISOString())

      if (logsError) throw logsError

      return {
        changes: {
          habits: {
            created: habits.map((h: any) => ({ ...h, id: h.id.toString(), category_id: h.category_id })),
            updated: [],
            deleted: []
          },
          habit_logs: {
            created: logs.map((l: any) => ({ ...l, id: l.id.toString(), habit_id: l.habit_id.toString() })),
            updated: [],
            deleted: []
          },
          categories: { created: [], updated: [], deleted: [] } // Placeholder
        } as SyncDatabaseChangeSet,
        timestamp: Date.now()
      }
    },
    pushChanges: async ({ changes }) => {
      // Push habits
      const habitsChanges = (changes as any).habits;
      if (habitsChanges && (habitsChanges.created.length > 0 || habitsChanges.updated.length > 0)) {
        const habitsToUpsert = [...habitsChanges.created, ...habitsChanges.updated].map(h => ({
          id: h.id,
          title: h.title,
          category_id: h.category_id,
          frequency: h.frequency,
          target_count: h.target_count,
          current_streak: h.current_streak,
          longest_streak: h.longest_streak,
          updated_at: new Date().toISOString()
        }))
        
        const { error } = await supabase.from('habits').upsert(habitsToUpsert)
        if (error) throw error
      }

      // Push logs
      const logsChanges = (changes as any).habit_logs;
      if (logsChanges && logsChanges.created.length > 0) {
        const logsToInsert = logsChanges.created.map((l: any) => ({
          id: l.id,
          habit_id: l.habit_id,
          date: l.date,
          count: l.count
        }))
        
        const { error } = await supabase.from('habit_logs').upsert(logsToInsert)
        if (error) throw error
      }
    },
    sendCreatedAsUpdated: true
  })
}
