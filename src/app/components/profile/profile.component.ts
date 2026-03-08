import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;

  constructor(private fb: FormBuilder, public auth: AuthService) {}

  ngOnInit() {
    const user = this.auth.currentUser || { name: '', email: '' };
    this.profileForm = this.fb.group({
      name: [user.name, Validators.required],
      email: [{ value: user.email, disabled: true }] // El email no se edita
    });
  }

  onSave() {
    if (this.profileForm.valid) {
      this.auth.updateProfile(this.profileForm.get('name')?.value);
      alert('Perfil actualizado correctamente');
    }
  }
}