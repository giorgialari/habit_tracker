import { EventColor } from 'calendar-utils';

export interface Habit {
  id: number;
  title: string;
  completed: boolean;
  completedAt: string;
  frequency: string[];
  startDate: string;
  endDate: string;
  remind: string;
  color: EventColor;
  isHabitToEdit?: boolean;
}

export interface CurrentMonth {
  number: number;
  dayOfWeek: string;
  month: string;
  completeDate: Date; //Data completa con giorno, mese, anno
}
