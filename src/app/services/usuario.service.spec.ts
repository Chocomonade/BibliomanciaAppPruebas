import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarios: Array<{ username: string, password: string }> = [];

  constructor() {}

  registrar(username: string, password: string): boolean {
    const existe = this.usuarios.find(u => u.username === username);
    if (existe) return false;

    this.usuarios.push({ username, password });
    console.log('Usuarios registrados:', this.usuarios);
    return true;
  }

  validarLogin(username: string, password: string): boolean {
    console.log('Usuarios disponibles:', this.usuarios);
    return this.usuarios.some(u => u.username === username && u.password === password);
  }
}
