import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(public toastController: ToastController) {}

  ngOnInit() {
  }


  async presentBetaToast() {
    const toast = await this.toastController.create({
      message: 'Sorry, this feature is not available in the beta version. Stay tuned for updates!',
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
  shareApp() {
    // Implementa la logica di condivisione
    console.log('Sharing the app...');
  }

  importExportData() {
    // Implementa la logica di import/export
    console.log('Import/Export data...');
  }

  viewAllHabits() {
    // Implementa la visualizzazione delle abitudini
    console.log('Viewing all habits...');
  }

  openPrivacyPolicy() {
    // Implementa la logica per aprire le impostazioni di privacy
    console.log('Opening privacy policy...');
  }
}
