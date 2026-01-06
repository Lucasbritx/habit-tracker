import { create } from 'zustand'
import { startOfDay, addDays, subDays, format } from 'date-fns'

interface DateState {
  selectedDate: Date
  setSelectedDate: (date: Date) => void
  nextDay: () => void
  prevDay: () => void
  isToday: () => boolean
}

export const useDateStore = create<DateState>((set, get) => ({
  selectedDate: startOfDay(new Date()),
  setSelectedDate: (date) => set({ selectedDate: startOfDay(date) }),
  nextDay: () => set((state) => ({ selectedDate: addDays(state.selectedDate, 1) })),
  prevDay: () => set((state) => ({ selectedDate: subDays(state.selectedDate, 1) })),
  isToday: () => {
    const today = startOfDay(new Date())
    const selected = get().selectedDate
    return today.getTime() === selected.getTime()
  }
}))
