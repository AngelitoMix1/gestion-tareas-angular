import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // 1. Separamos las llaves: Una para TODOS los usuarios, otra para la SESIÓN
  private usersKey = 'angular_all_users'; 
  private sessionKey = 'angular_session_user'; 
  
  currentUser: any = null;

  constructor(private router: Router) {
    // Al recargar la página, verificamos si hay una sesión activa
    const storedSession = localStorage.getItem(this.sessionKey);
    if (storedSession) {
      this.currentUser = JSON.parse(storedSession);
    }
  }

  register(userData: any) {
    // Obtenemos la lista histórica de usuarios (o un arreglo vacío si no hay)
    const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    
    // Verificamos que el correo no esté duplicado
    const exists = users.find((u: any) => u.email === userData.email);
    if(exists) {
      alert("Este correo ya está registrado.");
      return;
    }

    // Guardamos al nuevo usuario en la "base de datos"
    users.push(userData);
    localStorage.setItem(this.usersKey, JSON.stringify(users));

    // Iniciamos sesión automáticamente con este nuevo usuario
    this.currentUser = userData;
    localStorage.setItem(this.sessionKey, JSON.stringify(userData));
    
    this.router.navigate(['/tasks']);
  }

  login(email: string, pass: string) {
    // Buscamos las credenciales en la lista de TODOS los usuarios
    const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    const user = users.find((u: any) => u.email === email && u.password === pass);
    
    if (user) {
      // Si existe y la contraseña coincide, creamos la sesión
      this.currentUser = user;
      localStorage.setItem(this.sessionKey, JSON.stringify(user));
      this.router.navigate(['/tasks']);
      return true;
    }
    return false;
  }

  updateProfile(name: string) {
    if (this.currentUser) {
      // Actualizamos la sesión actual
      this.currentUser.name = name;
      localStorage.setItem(this.sessionKey, JSON.stringify(this.currentUser));
      
      // Actualizamos también el nombre en la lista global de usuarios
      const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
      const index = users.findIndex((u: any) => u.email === this.currentUser.email);
      if (index !== -1) {
        users[index].name = name;
        localStorage.setItem(this.usersKey, JSON.stringify(users));
      }
    }
  }

  logout() {
    this.currentUser = null;
    // IMPORTANTE: Solo borramos la sesión, NO la lista de usuarios
    localStorage.removeItem(this.sessionKey); 
    this.router.navigate(['/login']);
  }
}