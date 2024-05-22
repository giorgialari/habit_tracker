import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class PreventSetupGuard implements CanActivate {
  private _storage: Storage | null = null;

  constructor(private storage: Storage, private router: Router) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
  }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    // Assicurati che lo storage sia pronto
    if (!this._storage) {
      await this.init();
    }
    const storedValues = await this._storage?.get('user_setup_data');
    console.log('storedValues', storedValues);
    if (storedValues?.setupCompleted) {
      this.router.navigate(['/tabs/dashboard']); // Naviga a /tabs/dashboard
      return false; // Non consente l'attivazione della rotta corrente
    }
    return true; // Consente l'attivazione della rotta di setup
  }
}
