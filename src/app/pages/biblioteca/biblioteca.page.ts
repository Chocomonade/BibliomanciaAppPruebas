import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';

interface Libro {
  id: number;
  titulo: string;
  autor: string;
  portada: string;
  estado: 'pendiente' | 'leyendo' | 'terminado' | 'pausado';
  progreso?: number;
  fechaAgregado: Date;
  fechaInicio?: Date;
  fechaTerminado?: Date;
  genero?: string;
  paginas?: number;
}

@Component({
  selector: 'app-biblioteca',
  standalone: false,
  templateUrl: './biblioteca.page.html',
  styleUrls: ['./biblioteca.page.scss'],
})
export class BibliotecaPage implements OnInit {

  // Biblioteca completa
  biblioteca: Libro[] = [
    {
      id: 1,
      titulo: 'El eco del destino (Time Keeper)',
      autor: 'Iria G. Parente y Selene M. Pascual',
      portada: 'assets/img/el-eco-del-destino-time-keeper-1.jpg',
      estado: 'leyendo',
      progreso: 0.65,
      fechaAgregado: new Date('2024-12-01'),
      fechaInicio: new Date('2024-12-01'),
      genero: 'Fantasía',
      paginas: 400
    },
    {
      id: 2,
      titulo: 'El príncipe cautivo: el guerrero',
      autor: 'C.S. Pacat',
      portada: 'assets/img/el-principe-cautivo-el-guerrero.jpg',
      estado: 'pendiente',
      fechaAgregado: new Date('2024-12-10'),
      genero: 'Romance',
      paginas: 350
    },
    {
      id: 3,
      titulo: 'El café de la luna llena',
      autor: 'Mai Mochizuki',
      portada: 'assets/img/el-cafe-de-la-luna-llena.jpg',
      estado: 'pendiente',
      fechaAgregado: new Date('2024-12-08'),
      genero: 'Contemporáneo',
      paginas: 280
    },
    {
      id: 4,
      titulo: 'Klara y el Sol',
      autor: 'Kazuo Ishiguro',
      portada: 'assets/img/klara-y-el-sol.jpg',
      estado: 'terminado',
      progreso: 1,
      fechaAgregado: new Date('2024-11-15'),
      fechaInicio: new Date('2024-11-15'),
      fechaTerminado: new Date('2024-11-28'),
      genero: 'Ciencia Ficción',
      paginas: 320
    },
    {
      id: 5,
      titulo: 'La canción de Aquiles',
      autor: 'Madeline Miller',
      portada: 'assets/img/la-cancion-de-aquiles.jfif',
      estado: 'terminado',
      progreso: 1,
      fechaAgregado: new Date('2024-10-20'),
      fechaInicio: new Date('2024-10-20'),
      fechaTerminado: new Date('2024-11-10'),
      genero: 'Mitología',
      paginas: 416
    },
    {
      id: 6,
      titulo: 'Circe',
      autor: 'Madeline Miller',
      portada: 'assets/img/circe.webp',
      estado: 'pausado',
      progreso: 0.3,
      fechaAgregado: new Date('2024-11-01'),
      fechaInicio: new Date('2024-11-20'),
      genero: 'Mitología',
      paginas: 400
    }
  ];

  // Variables para filtros y vista
  librosFiltrados: Libro[] = [];
  filtroTexto: string = '';
  filtroEstado: string = 'todos';
  vistaGrid: boolean = true;

  // Getters para estadísticas
  get librosTotal(): number {
    return this.biblioteca.length;
  }

  constructor(
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {
    this.librosFiltrados = [...this.biblioteca];
  }

  // Cambiar entre vista grid y lista
  cambiarVista() {
    this.vistaGrid = !this.vistaGrid;
  }

  // Filtrar libros por texto
  filtrarLibros() {
    this.aplicarFiltros();
  }

  // Filtrar por estado
  filtrarPorEstado(estado: string) {
    this.filtroEstado = estado;
    this.aplicarFiltros();
  }

  // Aplicar todos los filtros
  aplicarFiltros() {
    let libros = [...this.biblioteca];

    // Filtro por estado
    if (this.filtroEstado !== 'todos') {
      libros = libros.filter(libro => libro.estado === this.filtroEstado);
    }

    // Filtro por texto
    if (this.filtroTexto.trim()) {
      const texto = this.filtroTexto.toLowerCase();
      libros = libros.filter(libro => 
        libro.titulo.toLowerCase().includes(texto) ||
        libro.autor.toLowerCase().includes(texto) ||
        (libro.genero && libro.genero.toLowerCase().includes(texto))
      );
    }

    this.librosFiltrados = libros;
  }

  // Contar libros por estado
  contarPorEstado(estado: string): number {
    return this.biblioteca.filter(libro => libro.estado === estado).length;
  }

  // Obtener ícono según estado
  getEstadoIcon(estado: string): string {
    switch (estado) {
      case 'leyendo': return 'book-outline';
      case 'terminado': return 'checkmark-circle';
      case 'pendiente': return 'bookmark-outline';
      case 'pausado': return 'pause-circle-outline';
      default: return 'book';
    }
  }

  // Obtener texto del estado
  getEstadoTexto(estado: string): string {
    switch (estado) {
      case 'leyendo': return 'Leyendo';
      case 'terminado': return 'Terminado';
      case 'pendiente': return 'Pendiente';
      case 'pausado': return 'Pausado';
      default: return 'Desconocido';
    }
  }

  // Empezar a leer un libro
  empezarLibro(libro: Libro) {
    const index = this.biblioteca.findIndex(l => l.id === libro.id);
    if (index !== -1) {
      this.biblioteca[index].estado = 'leyendo';
      this.biblioteca[index].fechaInicio = new Date();
      this.biblioteca[index].progreso = this.biblioteca[index].progreso || 0;
      this.aplicarFiltros();
      this.mostrarToast(`Empezando "${libro.titulo}"`);
    }
  }

  // Continuar leyendo un libro
  continuarLibro(libro: Libro) {
    // Aquí podrías navegar a la página de lectura
    this.mostrarToast(`Continuando "${libro.titulo}"`);
    console.log('Navegar a página de lectura:', libro.id);
  }

  // Mostrar opciones del libro
  async mostrarOpcionesLibro(libro: Libro) {
    const buttons = [];

    // Opciones según el estado
    if (libro.estado === 'pendiente') {
      buttons.push({
        text: 'Empezar a leer',
        icon: 'play',
        handler: () => this.empezarLibro(libro)
      });
    }

    if (libro.estado === 'leyendo') {
      buttons.push({
        text: 'Continuar leyendo',
        icon: 'book-outline',
        handler: () => this.continuarLibro(libro)
      });
      buttons.push({
        text: 'Pausar',
        icon: 'pause',
        handler: () => this.cambiarEstadoLibro(libro, 'pausado')
      });
      buttons.push({
        text: 'Marcar como terminado',
        icon: 'checkmark-circle',
        handler: () => this.cambiarEstadoLibro(libro, 'terminado')
      });
    }

    if (libro.estado === 'pausado') {
      buttons.push({
        text: 'Reanudar lectura',
        icon: 'play',
        handler: () => this.cambiarEstadoLibro(libro, 'leyendo')
      });
      buttons.push({
        text: 'Volver a pendientes',
        icon: 'bookmark',
        handler: () => this.cambiarEstadoLibro(libro, 'pendiente')
      });
    }

    if (libro.estado === 'terminado') {
      buttons.push({
        text: 'Releer',
        icon: 'refresh',
        handler: () => this.releerLibro(libro)
      });
    }

    // Opciones comunes
    buttons.push({
      text: 'Editar información',
      icon: 'create',
      handler: () => this.editarLibro(libro)
    });

    buttons.push({
      text: 'Eliminar de biblioteca',
      icon: 'trash',
      role: 'destructive',
      handler: () => this.eliminarLibro(libro)
    });

    buttons.push({
      text: 'Cancelar',
      icon: 'close',
      role: 'cancel'
    });

    const actionSheet = await this.actionSheetController.create({
      header: libro.titulo,
      buttons: buttons
    });

    await actionSheet.present();
  }

  // Cambiar estado de un libro
  cambiarEstadoLibro(libro: Libro, nuevoEstado: 'pendiente' | 'leyendo' | 'terminado' | 'pausado') {
    const index = this.biblioteca.findIndex(l => l.id === libro.id);
    if (index !== -1) {
      this.biblioteca[index].estado = nuevoEstado;
      
      if (nuevoEstado === 'terminado') {
        this.biblioteca[index].progreso = 1;
        this.biblioteca[index].fechaTerminado = new Date();
      } else if (nuevoEstado === 'leyendo' && !this.biblioteca[index].fechaInicio) {
        this.biblioteca[index].fechaInicio = new Date();
      }
      
      this.aplicarFiltros();
      this.mostrarToast(`"${libro.titulo}" marcado como ${this.getEstadoTexto(nuevoEstado).toLowerCase()}`);
    }
  }

  // Releer un libro
  releerLibro(libro: Libro) {
    const index = this.biblioteca.findIndex(l => l.id === libro.id);
    if (index !== -1) {
      this.biblioteca[index].estado = 'leyendo';
      this.biblioteca[index].progreso = 0;
      this.biblioteca[index].fechaInicio = new Date();
      this.aplicarFiltros();
      this.mostrarToast(`Empezando a releer "${libro.titulo}"`);
    }
  }

  // Editar información del libro
  async editarLibro(libro: Libro) {
    const alert = await this.alertController.create({
      header: 'Editar libro',
      inputs: [
        {
          name: 'titulo',
          type: 'text',
          placeholder: 'Título',
          value: libro.titulo
        },
        {
          name: 'autor',
          type: 'text',
          placeholder: 'Autor',
          value: libro.autor
        },
        {
          name: 'genero',
          type: 'text',
          placeholder: 'Género',
          value: libro.genero || ''
        },
        {
          name: 'paginas',
          type: 'number',
          placeholder: 'Número de páginas',
          value: libro.paginas?.toString() || ''
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.titulo && data.autor) {
              const index = this.biblioteca.findIndex(l => l.id === libro.id);
              if (index !== -1) {
                this.biblioteca[index].titulo = data.titulo;
                this.biblioteca[index].autor = data.autor;
                this.biblioteca[index].genero = data.genero || undefined;
                this.biblioteca[index].paginas = data.paginas ? parseInt(data.paginas) : undefined;
                this.aplicarFiltros();
                this.mostrarToast('Libro actualizado');
              }
            }
          }
        }
      ]
    });

    await alert.present();
  }

  // Eliminar libro
  async eliminarLibro(libro: Libro) {
    const alert = await this.alertController.create({
      header: 'Eliminar libro',
      message: `¿Estás seguro de que quieres eliminar "${libro.titulo}" de tu biblioteca?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.biblioteca = this.biblioteca.filter(l => l.id !== libro.id);
            this.aplicarFiltros();
            this.mostrarToast(`"${libro.titulo}" eliminado de la biblioteca`);
          }
        }
      ]
    });

    await alert.present();
  }

  // Agregar nuevo libro
  async agregarLibro() {
    const alert = await this.alertController.create({
      header: 'Agregar libro',
      inputs: [
        {
          name: 'titulo',
          type: 'text',
          placeholder: 'Título del libro'
        },
        {
          name: 'autor',
          type: 'text',
          placeholder: 'Autor'
        },
        {
          name: 'genero',
          type: 'text',
          placeholder: 'Género (opcional)'
        },
        {
          name: 'paginas',
          type: 'number',
          placeholder: 'Número de páginas (opcional)'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Agregar',
          handler: (data) => {
            if (data.titulo && data.autor) {
              const nuevoLibro: Libro = {
                id: Date.now(),
                titulo: data.titulo,
                autor: data.autor,
                portada: 'https://via.placeholder.com/150x200/cccccc/666666?text=Libro',
                estado: 'pendiente',
                fechaAgregado: new Date(),
                genero: data.genero || undefined,
                paginas: data.paginas ? parseInt(data.paginas) : undefined
              };
              this.biblioteca.unshift(nuevoLibro);
              this.aplicarFiltros();
              this.mostrarToast(`"${data.titulo}" agregado a la biblioteca`);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  // Mostrar toast
  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}