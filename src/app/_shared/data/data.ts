import { CustomCalendarView } from "../models/enum";

export const DAYS = [
  { id: 'mon', label: 'M', name: 'Lunedì' },
  { id: 'tue', label: 'T', name: 'Martedì' },
  { id: 'wed', label: 'W', name: 'Mercoledì' },
  { id: 'thu', label: 'T', name: 'Giovedì' },
  { id: 'fri', label: 'F', name: 'Venerdì' },
  { id: 'sat', label: 'S', name: 'Sabato' },
  { id: 'sun', label: 'S', name: 'Domenica' },
];

export const CATEGORIES = [
  { id: 1, label: 'Salute & Benessere', icon: 'fitness_center' },
  { id: 2, label: 'Studio & Apprendimento', icon: 'book' },
  { id: 3, label: 'Lavoro & Produttività', icon: 'work' },
  { id: 4, label: 'Personale & Relazioni', icon: 'person' },
];

//Colori complementari o traidici
export const COLORS_CATEGORIES = [
  { id: 1, hex: '#0077b6', name: 'Blu Oceano', textColor: '#f2f2f2' }, // grigio chiaro su blu scuro
  { id: 2, hex: '#0096c7', name: 'Cielo Sereno', textColor: '#f2f2f2' }, // grigio chiaro su blu chiaro
  { id: 3, hex: '#48cae4', name: 'Acqua Marina', textColor: '#1a1a1a' }, // quasi nero su azzurro chiaro
  { id: 4, hex: '#90e0ef', name: 'Ghiaccio Polare', textColor: '#1a1a1a' }, // quasi nero su celeste
  { id: 5, hex: '#00b4d8', name: 'Azzurro Sognante', textColor: '#f2f2f2' }, // grigio chiaro su azzurro
  { id: 7, hex: '#2a9d8f', name: 'Verde Smeraldo', textColor: '#f2f2f2' }, // grigio chiaro su verde
  { id: 8, hex: '#e9c46a', name: 'Giallo Sole', textColor: '#1a1a1a' }, // quasi nero su giallo
  { id: 9, hex: '#f4a261', name: 'Arancio Sabbia', textColor: '#1a1a1a' }, // quasi nero su arancione chiaro
  { id: 10, hex: '#e76f51', name: 'Rosso Vulcano', textColor: '#f2f2f2' }, // grigio chiaro su rosso
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
  {
    id: 3,
    label: 'ToDo',
    view: CustomCalendarView.Week,
    icon: 'check',
  },
];
