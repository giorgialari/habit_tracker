import { IContent, IStep } from "./stepper.interface";

export const steps: IStep[] = [
  {
    label: 'Step 1',
    active: true,
    title: 'Tell us a bit about yourself.',
    description: '',
    isLast: false,
    icon: ''
  },
  {
    label: 'Step 2',
    active: false,
    title: 'What habits do you want to work on?',
    description: 'Choose one or more habits.',
    isLast: false,
    icon: ''
  },
  {
    label: 'Step 3',
    active: false,
    title: 'When do you want us to remind you?',
    description: '',
    isLast: false,
    icon: ''
  },
  {
    label: 'Step 4',
    active: false,
    title: '',
    description: '',
    isLast: true,
    icon: ''
  }
];

export const contents: IContent = {
  steps: [
    [
      {
        id: 1,
        type: 'text',
        name: 'username',
        content: "Firstly, what's your name?",
        required: true
      },
      {
        id: 2,
        name: 'age',
        type: 'number',
        content: "How old are you?",
        required: false
      },
      {
        id: 3,
        name: 'location',
        type: 'text',
        content: "Where do you live?",
        required: false
      },
    ],
    [
      {
        id: 4,
        type: 'icon-block',
        name: '',
        title: 'Workout',
        icon: 'fitness_center',
        content: "What's your favorite color?",
        required: false
      },
      {
        id: 5,
        type: 'icon-block',
        name: '',
        title: 'Read More',
        icon: 'menu_book',
        content: "What's your favorite book?",
        required: false
      },
      {
        id: 7,
        type: 'icon-block',
        name: '',
        title: 'Take Picture',
        icon: 'camera_alt',
        content: "What's your favorite animal?",
        required: false
      },
      {
        id: 9,
        type: 'icon-block',
        name: '',
        title: 'Planning',
        icon: 'event_note',
        content: "What's your favorite food?",
        required: false
      },
      {
        id: 11,
        type: 'icon-block',
        name: '',
        title: 'Watch Movie',
        icon: 'movie',
        content: "What's your favorite movie?",
        required: false
      },
    ],
    [
      {
        id: 20,
        type: 'calendar',
        name: 'remind',
        content: "",
        required: false
      }
      // {
      //   id: 20,
      //   type: 'text-block',
      //   name: '',
      //   title: '6:00 AM',
      //   icon: '',
      //   content: "Morning",
      //   required: false
      // },
      // {
      //   id: 21,
      //   type: 'text-block',
      //   name: '',
      //   title: '12:00 AM',
      //   icon: '',
      //   content: "Noon",
      //   required: false
      // },
      // {
      //   id: 22,
      //   type: 'text-block',
      //   name: '',
      //   title: '6:00 PM',
      //   icon: '',
      //   content: "Evening",
      //   required: false
      // },
    ],
    [
      {
        id: 51,
        name: '',
        type: 'icon-text_no_form',
        content: "You are all set!",
        required: false,
        icon: 'done'
      },
    ]
  ]
};
