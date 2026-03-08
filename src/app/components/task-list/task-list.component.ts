import { Component, OnInit } from '@angular/core';
import { TaskService, Task } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  tasks$!: Observable<Task[]>;

  constructor(public taskService: TaskService, public auth: AuthService) {}

  ngOnInit() {
    // 1. Cargar las tareas correctas al entrar a la pantalla
    this.taskService.loadTasks(); 
    this.tasks$ = this.taskService.tasks$;
  }

  addTask(title: string) {
    if(title.trim()) {
      this.taskService.addTask(title);
    }
  }

  toggle(id: number) { this.taskService.toggleTask(id); }
  delete(id: number) { this.taskService.deleteTask(id); }
  
  logout() { 
    // 2. VACIAR la memoria de tareas antes de cerrar sesión
    this.taskService.clearTasks(); 
    this.auth.logout(); 
  }
}