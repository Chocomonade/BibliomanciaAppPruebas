import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonicModule, FormsModule, CommonModule]
})
export class LoginPage {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  login() {
    console.log('Botón presionado');

    const userRegex = /^[a-zA-Z0-9]{3,8}$/;
    const passRegex = /^\d{4}$/;

    if (!userRegex.test(this.username)) {
      alert('Usuario inválido. Usa entre 3 y 8 caracteres alfanuméricos.');
      return;
    }

    if (!passRegex.test(this.password)) {
      alert('La contraseña debe tener exactamente 4 dígitos numéricos.');
      return;
    }

    console.log('Redirigiendo con usuario:', this.username);
    this.router.navigate(['/home'], {
      state: { usuario: this.username }
    });
  }
}

