import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SetupResolver implements Resolve<any> {
  constructor(private storage: Storage, private router: Router) {
    this.storage.create();
  }

  resolve(): Observable<any> {
    return from(this.storage.get('user_setup_data')).pipe(
      map((data) => {
        if (!data || !data.setupCompleted) {
          this.router.navigate(['/setup']);
          return of(null);
        }
        return data;
      }),
      catchError(() => {
        this.router.navigate(['/setup']);
        return of(null);
      })
    );
  }
}
