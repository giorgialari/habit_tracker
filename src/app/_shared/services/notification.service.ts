// notification.service.ts
import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  // Richiede i permessi per le notifiche
  async requestPermissions(): Promise<boolean> {
    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted';
  }

  // Controlla i permessi attuali
  async checkPermissions(): Promise<boolean> {
    const status = await LocalNotifications.checkPermissions();
    return status.display === 'granted';
  }

  // Pianifica una notifica
  async scheduleNotification(time: Date, id: number, title: string, body: string) {
    const hasPermission = await this.checkPermissions();
    if (hasPermission) {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: title,
            body: body,
            id: id,
            schedule: { at: time },
            sound: '',
            attachments: [],
            actionTypeId: "",
            extra: null
          }
        ]
      });
    } else {
      console.error('Notification permissions not granted.');
      // Potrebbe essere un buon punto per chiedere nuovamente i permessi
    }
  }

  // Gestione quando l'utente fa un nuovo inserimento
  async handleNewNotification(time: Date, id: number, title: string, body: string) {
    const hasPermission = await this.checkPermissions();
    if (!hasPermission) {
      const permissionGranted = await this.requestPermissions();
      if (permissionGranted) {
        await this.scheduleNotification(time, id, title, body);
      } else {
        console.error('User denied notification permissions.');
        // Qui potresti voler informare l'utente che le notifiche sono disabilitate
      }
    } else {
      await this.scheduleNotification(time, id, title, body);
    }
  }
}
