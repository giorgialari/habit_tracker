import { Habit } from "../../_shared/models/habits.interface";

export const myHabitsMock: Habit[] = [{
  id: 1,
  title: 'Read 10 page of a book',
  completed: true,
  completedAt: '10:00 AM',
  frequency: ['mon', 'wed', 'fri'],
  startDate: '2021-09-01',
  endDate: '',
  remind: '09:00 AM',

},
{
  id: 2,
  title: 'Meditate for 10 minutes',
  completed: false,
  completedAt: '',
  frequency: ['tue', 'thu', 'sat'],
  startDate: '2021-09-01',
  endDate: '',
  remind: '09:00 AM',
},
{
  id: 3,
  title: 'Go for a walk',
  completed: true,
  completedAt: '10:00 AM',
  frequency: ['mon', 'wed', 'fri'],
  startDate: '2021-09-01',
  endDate: '',
  remind: '09:00 AM',
}
];
