import { EventColor } from 'calendar-utils';

export interface CustomEventHabits {
  id: number;
  habitId: number;
  start: Date;
  end: Date;
  title: string;
  color: EventColor;
  actions: { label: string; a11yLabel: string; }[];
  allDay: boolean;
  draggable: boolean;
  resizable: { beforeStart: boolean; afterEnd: boolean; };
  completed: boolean;
  completedAt: string;
}
