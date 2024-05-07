import { Component, OnInit } from '@angular/core';
import { IContent } from './stepper/models/stepper.interface';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
})
export class SetupComponent implements OnInit {
  steps = [{ label: 'Step 1', active: true },
  { label: 'Step 2', active: false },
  { label: 'Step 3', active: false },
  { label: 'Step 4', active: false }]


  contents: IContent = {
    steps: [
      [
        { id: 1, type: 'text', content: "Firstly, what's your name?", required: false },
        { id: 2, type: 'text', content: "How old are you?", required: false },
        { id: 3, type: 'text', content: "Where do you live?", required: false },
      ],
      [
        {
          id: 4, type: 'icon-block',
          title: 'Workout',
          icon: 'fitness_center',
          content: "What's your favorite color?", required: false
        },
        //read more
        {
          id: 5, type: 'icon-block',
          title: 'Read More',
          icon: 'menu_book',
          content: "What's your favorite book?", required: false
        },
        //take picture
        {
          id: 7, type: 'icon-block',
          title: 'Take Picture',
          icon: 'camera_alt',
          content: "What's your favorite animal?", required: false
        },
        //planning
        {
          id: 9, type: 'icon-block',
          title: 'Planning',
          icon: 'event_note',
          content: "What's your favorite food?", required: false
        },
        //watch movie
        {
          id: 11, type: 'icon-block',
          title: 'Watch Movie',
          icon: 'movie',
          content: "What's your favorite movie?", required: false
        },

        // meditate
        {
          id: 13, type: 'icon-block',
          title: 'Meditate',
          icon: 'self_improvement',
          content: "What's your favorite movie?", required: false
        },
        //write
        {
          id: 15, type: 'icon-block',
          title: 'Write',
          icon: 'create',
          content: "What's your favorite movie?", required: false
        },
        //draw
        {
          id: 17, type: 'icon-block',
          title: 'Draw',
          icon: 'brush',
          content: "What's your favorite movie?", required: false
        },
        //listen music
        {
          id: 19, type: 'icon-block',
          title: 'Listen Music',
          icon: 'music_note',
          content: "What's your favorite movie?", required: false
        },

      ],
      [
        { id: 50, type: 'text', content: "What's your favorite food?", required: false },
      ],
      [
        { id: 51, type: 'text', content: "What's your favorite movie?", required: false },
      ]
    ]
  }
  constructor() { }

  ngOnInit() { }

}
