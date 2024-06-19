import { EventColor, EventAction } from 'calendar-utils';

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

export interface CustomCalendarEvent<MetaType = any> {
  id?:  number;
  idMaster: number;
  start: Date;
  end?: Date;
  title: string;
  color?: EventColor;
  actions?: EventAction[];
  goal: number;
  goalType: string;
  customGoalType: string;
  actualGoal: number;
  allDay?: boolean;
  cssClass?: string;
  resizable?: {
      beforeStart?: boolean;
      afterEnd?: boolean;
  };
  draggable?: boolean;
  meta?: MetaType;
}
