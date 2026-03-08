import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

export interface Task { 
  id: number; 
  title: string; 
  completed: boolean; 
  userEmail: string; 
}

@Injectable({ 
  providedIn: 'root' 
})
export class TaskService {
  private tasks: Task[] = [];
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();
  
  private storageKey = 'angular_tasks';

  constructor(private authService: AuthService) {}

  loadTasks() {
    const storedTasks = localStorage.getItem(this.storageKey);
    const currentUser = this.authService.currentUser;

    if (storedTasks && currentUser) {
      const allTasks: Task[] = JSON.parse(storedTasks);
      // Filtramos ESTRICTAMENTE por el correo del usuario actual
      this.tasks = allTasks.filter(t => t.userEmail === currentUser.email);
    } else {
      this.tasks = [];
    }
    this.updateSubject();
  }

  // NUEVO MÉTODO: Limpia la memoria RAM de las tareas
  clearTasks() {
    this.tasks = [];
    this.updateSubject();
  }

  addTask(title: string) {
    const currentUser = this.authService.currentUser;
    if (!currentUser) return;

    const newTask: Task = { 
      id: Date.now(), 
      title, 
      completed: false,
      userEmail: currentUser.email 
    };
    
    this.tasks.push(newTask);
    this.saveTasksToStorage();
    this.updateSubject();
  }

  toggleTask(id: number) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveTasksToStorage();
      this.updateSubject();
    }
  }

  deleteTask(id: number) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveTasksToStorage();
    this.updateSubject();
  }

  private saveTasksToStorage() {
    const storedTasks = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    const currentUser = this.authService.currentUser;
    
    if (currentUser) {
      const otherUsersTasks = storedTasks.filter((t: Task) => t.userEmail !== currentUser.email);
      const allTasksToSave = [...otherUsersTasks, ...this.tasks];
      localStorage.setItem(this.storageKey, JSON.stringify(allTasksToSave));
    }
  }

  private updateSubject() { 
    this.tasksSubject.next([...this.tasks]); 
  }
}