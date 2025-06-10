import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

interface ReadingProgress {
  id: string;
  bookTitle: string;
  currentPage: number;
  totalPages: number;
  date: string;
  notes?: string;
}

@Component({
  selector: 'app-progreso',
  standalone: false,
  templateUrl: './progreso.page.html',
  styleUrls: ['./progreso.page.scss'],
})
export class ProgresoPage implements OnInit {
  currentBook = {
    id: '1',
    title: 'El eco del destino (Time Keeper)',
    author: 'Iria G. Parente y Selene M. Pascual',
    totalPages: 480,
    coverUrl: 'assets/img/el-eco-del-destino-time-keeper-1.jpg'
  };

  progressForm = {
    currentPage: 0,
    date: new Date().toISOString(),
    notes: ''
  };

  readingHistory: ReadingProgress[] = [];
  progressPercentage = 0;

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadReadingHistory();
    this.calculateProgress();
  }

  loadReadingHistory() {
    // Simular datos guardados - en tu app real cargarías desde storage o API
    const savedHistory = [
      {
        id: '1',
        bookTitle: this.currentBook.title,
        currentPage: 45,
        totalPages: this.currentBook.totalPages,
        date: '2024-06-07T10:30:00.000Z',
        notes: 'Capítulo muy interesante'
      },
      {
        id: '2',
        bookTitle: this.currentBook.title,
        currentPage: 312,
        totalPages: this.currentBook.totalPages,
        date: '2024-06-08T15:45:00.000Z',
        notes: ''
      }
    ];

    this.readingHistory = savedHistory.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Establecer la página actual basada en el último registro
    if (this.readingHistory.length > 0) {
      this.progressForm.currentPage = this.readingHistory[0].currentPage;
    }
  }

  calculateProgress() {
    this.progressPercentage = (this.progressForm.currentPage / this.currentBook.totalPages) * 100;
    this.progressPercentage = Math.min(Math.max(this.progressPercentage, 0), 100);
  }

  onPageChange() {
    this.calculateProgress();
  }

  async saveProgress() {
    if (this.progressForm.currentPage < 0 || this.progressForm.currentPage > this.currentBook.totalPages) {
      await this.showAlert('Error', 'La página debe estar entre 0 y ' + this.currentBook.totalPages);
      return;
    }

    const newProgress: ReadingProgress = {
      id: Date.now().toString(),
      bookTitle: this.currentBook.title,
      currentPage: this.progressForm.currentPage,
      totalPages: this.currentBook.totalPages,
      date: this.progressForm.date,
      notes: this.progressForm.notes
    };

    // Agregar al historial
    this.readingHistory.unshift(newProgress);
    
    // Aquí guardarías en tu storage o API
    // await this.storageService.saveReadingProgress(newProgress);

    await this.showToast('Progreso guardado exitosamente');
    
    // Limpiar formulario
    this.progressForm.notes = '';
    this.progressForm.date = new Date().toISOString();
  }

  async deleteProgress(progress: ReadingProgress) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar este registro?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.readingHistory = this.readingHistory.filter(p => p.id !== progress.id);
            this.showToast('Registro eliminado');
          }
        }
      ]
    });

    await alert.present();
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color: 'success'
    });
    await toast.present();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getProgressColor(): string {
    if (this.progressPercentage < 25) return 'danger';
    if (this.progressPercentage < 50) return 'warning';
    if (this.progressPercentage < 75) return 'primary';
    return 'success';
  }
}
