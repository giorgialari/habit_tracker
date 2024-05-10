import { Habit } from "./habits.interface";

export const myHabitsMock: Habit[] = [{
  id: 1,
  title: 'Read 10 page of a book',
  description: 'Read 10 page of a book',
  completed: true,
  completedAt: '10:00 AM',
},
{
  id: 2,
  title: 'Meditate for 10 minutes',
  description: 'Meditate for 10 minutes',
  completed: false,
  completedAt: '',
},
{
  id: 3,
  title: 'Go for a walk',
  description: 'Go for a walk',
  completed: true,
  completedAt: '10:00 AM',
}
];
