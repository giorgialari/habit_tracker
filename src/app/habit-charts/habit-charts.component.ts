import { Component } from '@angular/core';
import { HabitService } from '../_shared/services/habit.service';

@Component({
  selector: 'app-habit-charts',
  templateUrl: './habit-charts.component.html',
  styleUrls: ['./habit-charts.component.scss'],
})
export class HabitChartsComponent {
  public pieChartData: any;
  public barChartData: any;

  primo: any = null;
  secondo: any = null;
  terzo: any = null;

  public chartOptions = {
    responsive: true, // Rende il grafico responsivo
    maintainAspectRatio: false, // Impedisce al grafico di mantenere il rapporto di aspetto fisso
  };

  constructor(private habitService: HabitService) {}

  async ngOnInit() {
    const habits = await this.habitService.getAllHabits();
    if (habits && habits.length > 0) {
      // Ordina le abitudini in base al mood in modo decrescente
      const sortedHabits = habits.sort((a, b) => b.mood - a.mood);
      this.primo = sortedHabits[0] || null;
      this.secondo = sortedHabits[1] || null;
      this.terzo = sortedHabits[2] || null;
    }
    this.initPieChart(habits);
    this.initBarChart(habits);
  }

  private initPieChart(habits: any[]) {
    const completed = habits.filter((h) => h.completed).length;
    const notCompleted = habits.length - completed;
    this.pieChartData = {
      labels: ['Completate', 'Non Completate'],
      datasets: [
        {
          data: [completed, notCompleted],
          backgroundColor: ['#4CAF50', '#FF6384'],
        },
      ],
    };
  }

  private initBarChart(habits: any[]) {
    const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    let dayCounts = Array(7).fill(0);

    habits.forEach((habit) => {
      habit.frequency.forEach((day: any) => {
        const index = daysOfWeek.indexOf(day);
        if (index !== -1) {
          dayCounts[index]++;
        }
      });
    });

    this.barChartData = {
      labels: daysOfWeek,
      datasets: [
        {
          label: 'Numero di Habits per Giorno',
          data: dayCounts,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  }
}
