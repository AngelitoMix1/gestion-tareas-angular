import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserKey = 'angular_session_user';
  currentUser: any = null;

  constructor(private router: Router) {
    const storedUser = localStorage.getItem(this.currentUserKey);
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  register(userData: any) {
    this.currentUser = userData;
    localStorage.setItem(this.currentUserKey, JSON.stringify(userData));
    this.router.navigate(['/tasks']);
  }

  login(email: string, pass: string) {
    const storedUser = JSON.parse(localStorage.getItem(this.currentUserKey) || 'null');
    // Para simplificar la simulación, si hay un usuario guardado y el correo coincide, entra.
    if (storedUser && storedUser.email === email && storedUser.password === pass) {
      this.currentUser = storedUser;
      this.router.navigate(['/tasks']);
      return true;
    }
    return false;
  }

  updateProfile(name: string) {
    if (this.currentUser) {
      this.currentUser.name = name;
      localStorage.setItem(this.currentUserKey, JSON.stringify(this.currentUser));
    }
  }

  logout() {
    this.currentUser = null;
    this.router.navigate(['/login']);
  }
}