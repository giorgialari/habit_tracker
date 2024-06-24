// // notification.service.ts
// import { Injectable } from '@angular/core';
// import { LocalNotifications } from '@capacitor/local-notifications';

// @Injectable({
//   providedIn: 'root'
// })
// export class NotificationService {

//   constructor() { }

//   // Richiede i permessi per le notifiche
//   async requestPermissions(): Promise<boolean> {
//     const result = await LocalNotifications.requestPermissions();
//     return result.display === 'granted';
//   }

//   // Controlla i permessi attuali
//   async checkPermissions(): Promise<boolean> {
//     const status = await LocalNotifications.checkPermissions();
//     return status.display === 'granted';
//   }

//   // Pianifica una notifica
//   async scheduleNotification(time: Date, id: number, title: string, body: string) {
//     const hasPermission = await this.checkPermissions();
//     if (hasPermission) {
//       await LocalNotifications.schedule({
//         notifications: [
//           {
//             title: title,
//             body: body,
//             id: id,
//             schedule: { at: time },
//             sound: '',
//             attachments: [],
//             actionTypeId: "",
//             extra: null
//           }
//         ]
//       });
//     } else {
//       console.error('Notification permissions not granted.');
//       // Potrebbe essere un buon punto per chiedere nuovamente i permessi
//     }
//   }

//   // Gestione quando l'utente fa un nuovo inserimento
//   async handleNewNotification(time: Date, id: number, title: string, body: string) {
//     const hasPermission = await this.checkPermissions();
//     if (!hasPermission) {
//       const permissionGranted = await this.requestPermissions();
//       if (permissionGranted) {
//         await this.scheduleNotification(time, id, title, body);
//       } else {
//         console.error('User denied notification permissions.');
//         // Qui potresti voler informare l'utente che le notifiche sono disabilitate
//       }
//     } else {
//       await this.scheduleNotification(time, id, title, body);
//     }
//   }
// }


import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private router: Router) {
    this.initializeNotificationListeners();
  }

  // Metodo per inizializzare gli ascoltatori di eventi delle notifiche
  private initializeNotificationListeners() {
    LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
      this.handleNotificationClick(notification);
    });
  }

  // Metodo per gestire il clic sulla notifica
  private handleNotificationClick(notification: any) {
    // Qui puoi controllare l'id della notifica o altri dettagli per decidere dove navigare
    // Ad esempio, controlla l'actionTypeId per decidere la rotta
    if (notification.actionId === 'OPEN_DASHBOARD') {
      this.router.navigateByUrl('/tabs/dashboard');
    }
  }

  // Metodo per richiedere i permessi per le notifiche
  async requestPermissions(): Promise<boolean> {
    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted';
  }

  // Metodo per controllare i permessi attuali
  async checkPermissions(): Promise<boolean> {
    const status = await LocalNotifications.checkPermissions();
    return status.display === 'granted';
  }

  // Metodo per pianificare una notifica
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
            actionTypeId: 'OPEN_DASHBOARD',
            sound: '',
            extra: null
          }
        ]
      });
    } else {
      console.error('Notification permissions not granted.');
      // Potrebbe essere un buon punto per chiedere nuovamente i permessi
    }
  }

  // Metodo per gestire un nuovo inserimento di notifica
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
