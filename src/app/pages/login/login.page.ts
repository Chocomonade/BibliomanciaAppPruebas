import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';  // ✅ OBLIGATORIO
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonicModule, FormsModule, CommonModule, RouterModule]
})
export class LoginPage {
  username: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  login() {
    console.log('Username from model:', this.username);
    console.log('Password from model:', this.password);

    const isValid = this.usuarioService.validarLogin(this.username, this.password);

    if (!isValid) {
      alert('Usuario o contraseña incorrectos.');
      return;
    }

    this.router.navigate(['/home'], {
      state: { usuario: this.username }
    });
  }
}


