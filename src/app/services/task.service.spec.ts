import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Task { id: number; title: string; completed: boolean; }

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasks: Task[] = [];
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  addTask(title: string) {
    const newTask: Task = { id: Date.now(), title, completed: false };
    this.tasks.push(newTask);
    this.updateSubject();
  }

  toggleTask(id: number) {
    const task = this.tasks.find(t => t.id === id);
    if (task) task.completed = !task.completed;
    this.updateSubject();
  }

  deleteTask(id: number) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.updateSubject();
  }

  private updateSubject() { 
    this.tasksSubject.next([...this.tasks]); 
  }
}