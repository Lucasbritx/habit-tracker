import { differenceInCalendarDays, parseISO } from 'date-fns'

export const calculateStreak = (dates: string[]): number => {
  if (dates.length === 0) return 0

  // Sort dates descending (newest first)
  const sortedDates = [...dates].sort((a, b) => b.localeCompare(a))
  const today = new Date()
  
  // Check if the most recent date is today or yesterday
  const lastDate = parseISO(sortedDates[0])
  const diffFromToday = differenceInCalendarDays(today, lastDate)

  // If last completion was more than 1 day ago (yesterday), streak is broken
  // Exception: if we are calculating BEFORE checking today's status, 
  // and user missed yesterday, it's 0. If they did yesterday, it's continued.
  // BUT: This is a simplified version. Usually we check if 'yesterday' exists.
  
  if (diffFromToday > 1) {
    return 0
  }

  let streak = 1
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const current = parseISO(sortedDates[i])
    const next = parseISO(sortedDates[i + 1])
    
    const diff = differenceInCalendarDays(current, next)
    
    if (diff === 1) {
      streak++
    } else if (diff === 0) {
      // Same day, ignore
      continue
    } else {
      // Gap found
      break
    }
  }

  return streak
}
