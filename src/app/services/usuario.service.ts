import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuariosRegistrados: { usuario: string; password: string }[] = [];

registrar(usuario: string, password: string): boolean {
  if (this.usuariosRegistrados.some(u => u.usuario === usuario)) {
    return false;
  }
  this.usuariosRegistrados.push({ usuario, password });
  return true;
}

validarLogin(usuario: string, password: string): boolean {
  return this.usuariosRegistrados.some(
    u => u.usuario === usuario && u.password === password
  );
}
}

