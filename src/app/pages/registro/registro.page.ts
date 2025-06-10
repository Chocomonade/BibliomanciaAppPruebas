import { Component } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';

// Angular Material
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registro',
  standalone: true,
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule
  ]
})
export class RegistroPage {
  nombreUsuario = '';
  password = '';
  nivel = '';
  fechaNacimiento: Date | null = null;
  fechaMaxima = new Date(); // Fecha actual como máximo

   // Simulación de almacenamiento
  usuariosRegistrados: any[] = [];

  constructor(private alertCtrl: AlertController, private router: Router, private usuarioService: UsuarioService) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state?.['usuario']) {
      this.nombreUsuario = nav.extras.state['usuario'];
    }
  }

  // Validación de campos vacíos
  private validarCampos(): boolean {
    if (!this.nombreUsuario.trim()) {
      this.mostrarError('El campo Nombre de usuario es obligatorio');
      return false;
    }

    if (!this.password.trim() || this.password.length < 6) {
    this.mostrarError('La contraseña debe tener al menos 6 caracteres');
    return false;
  }

    if (!this.nivel.trim()) {
      this.mostrarError('El campo Nivel de Lectura es obligatorio');
      return false;
    }

    if (!this.fechaNacimiento) {
      this.mostrarError('El campo Fecha de nacimiento es obligatorio');
      return false;
    }

    const hoy = new Date();
    const diezAniosAtras = new Date(
      hoy.getFullYear() - 10,
      hoy.getMonth(),
      hoy.getDate()
    );

    if (this.fechaNacimiento > diezAniosAtras) {
      this.mostrarError('Debes tener al menos 10 años para registrarte');
      return false;
    }
    
    return true;
  }

  // Método para mostrar errores
  private async mostrarError(mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: 'Error de validación',
      message: mensaje,
      buttons: ['OK'],
      cssClass: 'alert-error'
    });
    await alert.present();
  }

  async registrar() {
    if (!this.validarCampos()) return;

  const registrado = this.usuarioService.registrar(this.nombreUsuario, this.password);
  if (!registrado) {
    this.mostrarError('Este usuario ya está registrado');
    return;
  }

  const alert = await this.alertCtrl.create({
    header: '¡Registro exitoso!',
    message: 'Tu cuenta fue creada exitosamente.',
    buttons: ['OK'],
    cssClass: 'alert-success'
  });
  await alert.present();

  // Redirigir al login tras un pequeño delay
  setTimeout(() => {
    this.router.navigate(['/login']);
  }, 500); // o espera a que cierre el alert si prefieres
}


  async volverAlLogin() {
  await this.router.navigateByUrl('/login', { 
    replaceUrl: true,
    skipLocationChange: false 
  });
}

}
