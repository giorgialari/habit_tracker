import { CustomCalendarView } from '../models/enum';

export const DAYS = [
  { id: 'mon', label: 'M', name: 'Monday' },
  { id: 'tue', label: 'T', name: 'Tuesday' },
  { id: 'wed', label: 'W', name: 'Wednesday' },
  { id: 'thu', label: 'T', name: 'Thursday' },
  { id: 'fri', label: 'F', name: 'Friday' },
  { id: 'sat', label: 'S', name: 'Saturday' },
  { id: 'sun', label: 'S', name: 'Sunday' },
];

export const CATEGORIES = [
  { id: 1, label: 'Health & Wellness', icon: 'fitness_center' },
  { id: 2, label: 'Study & Learning', icon: 'book' },
  { id: 3, label: 'Work & Productivity', icon: 'work' },
  { id: 4, label: 'Personnel & Relationships', icon: 'person' },
];

//Colori complementari o traidici
export const COLORS_CATEGORIES = [
  { id: 1, hex: '#0077b6', name: 'Ocean Blue', textColor: '#f2f2f2' }, // grigio chiaro su blu scuro
  { id: 2, hex: '#0096c7', name: 'Clear Sky', textColor: '#f2f2f2' }, // grigio chiaro su blu chiaro
  { id: 3, hex: '#48cae4', name: 'Aqua Marina', textColor: '#1a1a1a' }, // quasi nero su azzurro chiaro
  { id: 4, hex: '#90e0ef', name: 'Polar Ice', textColor: '#1a1a1a' }, // quasi nero su celeste
  { id: 5, hex: '#00b4d8', name: 'Dreamy Blue', textColor: '#f2f2f2' }, // grigio chiaro su azzurro
  { id: 7, hex: '#2a9d8f', name: 'Emerald Green', textColor: '#f2f2f2' }, // grigio chiaro su verde
  { id: 8, hex: '#e9c46a', name: 'Sunshine Yellow', textColor: '#1a1a1a' }, // quasi nero su giallo
  { id: 9, hex: '#f4a261', name: 'Sand Orange', textColor: '#1a1a1a' }, // quasi nero su arancione chiaro
  { id: 10, hex: '#e76f51', name: 'Volcano Red', textColor: '#f2f2f2' }, // grigio chiaro su rosso
];

export const TABS = [
  {
    id: 1,
    label: 'Day',
    view: CustomCalendarView.Day,
    icon: 'today',
  },
  {
    id: 2,
    label: 'Month',
    view: CustomCalendarView.Month,
    icon: 'calendar_month',
  },
];

export const GOALTYPES = [
  { id: 1, label: 'Times', value: 'volte' },
  { id: 2, label: 'Custom', value: 'custom' },
];
