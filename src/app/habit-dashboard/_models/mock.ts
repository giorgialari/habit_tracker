import { Habit } from "./habits.interface";

export const myHabitsMock: Habit[] = [{
  id: 1,
  title: 'Read 10 page of a book',
  completed: true,
  completedAt: '10:00 AM',
  frequency: ['mon', 'wed', 'fri'],
  remind: 'Morning'
},
{
  id: 2,
  title: 'Meditate for 10 minutes',
  completed: false,
  completedAt: '',
  frequency: ['tue', 'thu', 'sat'],
  remind: 'Evening'
},
{
  id: 3,
  title: 'Go for a walk',
  completed: true,
  completedAt: '10:00 AM',
  frequency: ['mon', 'wed', 'fri'],
  remind: 'Morning'
}
];
