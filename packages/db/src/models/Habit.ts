import { Model } from '@nozbe/watermelondb'
import { field, date, readonly, children } from '@nozbe/watermelondb/decorators'

export default class Habit extends Model {
  static table = 'habits'

  @field('title') title!: string
  @field('description') description?: string
  @field('category_id') categoryId!: string
  @field('frequency') frequency!: string
  @field('target_count') targetCount!: number
  @field('current_streak') currentStreak!: number
  @field('longest_streak') longestStreak!: number
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number

  @children('habit_logs') logs!: any
}
