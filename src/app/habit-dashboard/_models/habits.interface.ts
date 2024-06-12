import { EventColor } from 'calendar-utils';

export interface Habit {
  id: number;
  category: Category;
  title: string;
  completed: boolean;
  completedAt: string;
  frequency: string[];
  allDay: boolean;
  startDate: string;
  endDate: string;
  goal: number;
  goalType: string;
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

export interface Category {
  id: number;
  icon: string;
  label: string;
}
