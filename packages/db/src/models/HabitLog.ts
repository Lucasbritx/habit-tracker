import { Model } from '@nozbe/watermelondb'
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators'
import Habit from './Habit'

export default class HabitLog extends Model {
  static table = 'habit_logs'

  @relation('habits', 'habit_id') habit!: any
  @field('date') date!: string
  @field('count') count!: number
  @readonly @date('created_at') createdAt!: number
}
