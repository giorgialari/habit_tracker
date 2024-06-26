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
  public categoryChartData: any;

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
    this.initCategoryChart(habits);
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

  private initCategoryChart(habits: any[]) {
    const categoryProgress = habits.reduce((acc, habit) => {
      const category = habit.category.label;
      if (!acc[category]) {
        acc[category] = { completed: 0, total: 0 };
      }
      acc[category].total++;
      if (habit.completed) {
        acc[category].completed++;
      }
      return acc;
    }, {});

    const labels = Object.keys(categoryProgress);
    const completedData = labels.map(
      (label) => categoryProgress[label].completed
    );
    const totalData = labels.map((label) => categoryProgress[label].total);

    this.categoryChartData = {
      labels: labels,
      datasets: [
        {
          data: completedData,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
          ],
          label: 'Completed',
        },
        {
          data: totalData,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
          ].map((color) => this.lightenColor(color, 30)),
          label: 'Total',
        },
      ],
    };
  }

  private lightenColor(color: string, amount: number): string {
    // Rimuovi il carattere '#' se presente
    color = color.replace(/^#/, '');

    // Converti il colore in RGB
    let r = parseInt(color.slice(0, 2), 16);
    let g = parseInt(color.slice(2, 4), 16);
    let b = parseInt(color.slice(4, 6), 16);

    // Aumenta ciascun componente del colore
    r = Math.min(255, Math.round(r + (255 - r) * (amount / 100)));
    g = Math.min(255, Math.round(g + (255 - g) * (amount / 100)));
    b = Math.min(255, Math.round(b + (255 - b) * (amount / 100)));

    // Converti di nuovo in formato esadecimale
    const rHex = r.toString(16).padStart(2, '0');
    const gHex = g.toString(16).padStart(2, '0');
    const bHex = b.toString(16).padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`;
  }
}
