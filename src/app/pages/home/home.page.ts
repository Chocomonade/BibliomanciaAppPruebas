import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AlertController } from '@ionic/angular';
import { AfterViewInit } from '@angular/core';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements AfterViewInit {
  nombreUsuario = '';
  libroActual = {
  titulo : 'El eco del destino (Time Keeper)',
  autor : 'Iria G. Parente y Selene M. Pascual',
  portada: 'assets/img/el-eco-del-destino-time-keeper-1.jpg',
  progreso: 0.65
  }

  librosPorLeer = [
    {
      titulo: 'El príncipe cautivo: el guerrero',
      autor: 'C.S. Pacat',
      portada: 'assets/img/el-principe-cautivo-el-guerrero.jpg',
    },

    {
      titulo: 'El café de la luna llena',
      autor: 'Mai Mochizuki',
      portada: 'assets/img/el-cafe-de-la-luna-llena.jpg',
    }

  ];

  estadisticas = {
    librosTerminados: 2,
    tiempoLectura: '3h'
  };

    irAProgreso() {
    this.router.navigate(['/progreso']);
  }

  constructor(private router: Router, private alertController: AlertController, private animationCtrl: AnimationController) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state?.['usuario']) {
      this.nombreUsuario = nav.extras.state['usuario'];
    }
  }

  irAMiBiblioteca() {
    this.router.navigate(['/biblioteca']);
  }

   empezarLibro(libro: any) {
    // Cambiar el libro actual
    this.libroActual = {
      ...libro,
      progreso: 0
    };
    
    // Remover de la lista de pendientes
    this.librosPorLeer = this.librosPorLeer.filter(l => l.titulo !== libro.titulo);
    
    // Mostrar mensaje
    console.log(`Empezando a leer: ${libro.titulo}`);
  }

  async agregarLibro() {
  const alert = await this.alertController.create({
    header: 'Agregar libro',
    message: 'Funcionalidad en desarrollo',
    buttons: ['OK']
  });

  await alert.present();
}

ngAfterViewInit() {
  // Animación 1: libro actual
  const libroActual = document.querySelector('.libro-actual-card');
  if (libroActual) {
    this.animationCtrl.create()
      .addElement(libroActual)
      .duration(1000)
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'translateY(20px)', 'translateY(0)')
      .play();
  }

  // Animación 2: botón de biblioteca
  const botonBiblioteca = document.querySelector('ion-button[color="tertiary"]');
  if (botonBiblioteca) {
    this.animationCtrl.create()
      .addElement(botonBiblioteca)
      .duration(1000)
      .delay(300)
      .fromTo('transform', 'scale(0.8)', 'scale(1)')
      .fromTo('opacity', '0', '1')
      .play();
  }
}
}
