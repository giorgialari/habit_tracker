import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabHabitDailyJournalPage } from './tab-habit-daily-journal.page';
import { TabHabitDailyJournalPageRoutingModule } from './tab-habit-daily-journal-routing.module';
import { HabitDailyJournalComponentModule } from '../../habit-daily-journal/habit-daily-journal.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HabitDailyJournalComponentModule,
    TabHabitDailyJournalPageRoutingModule
  ],
  declarations: [TabHabitDailyJournalPage]
})
export class TabHabitDailyJournalPageModule {}
