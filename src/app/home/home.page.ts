import { Component } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
  ]
})
export class HomePage {
  nombreUsuario = '';
  nombre = '';
  apellido = '';
  nivel = '';
  fechaNacimiento: Date | null = null;

  constructor(private alertCtrl: AlertController, private router: Router) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state?.['usuario']) {
      this.nombreUsuario = nav.extras.state['usuario'];
    }
  }

  limpiar() {
    this.nombre = '';
    this.apellido = '';
    this.nivel = '';
    this.fechaNacimiento = null;

    const elementos = document.querySelectorAll('.animable');
    elementos.forEach((el) => {
      el.classList.add('animar');
      setTimeout(() => el.classList.remove('animar'), 1000);
    });
  }

  async mostrar() {
    const alert = await this.alertCtrl.create({
      header: 'Datos ingresados',
      message: `Su nombre es ${this.nombre}\n${this.apellido}`,
      buttons: ['OK']
    });
    await alert.present();
  }
}

