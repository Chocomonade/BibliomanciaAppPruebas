import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RegistroPage } from './registro.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RegistroPage, // 👈 aquí lo importas como módulo
    RouterModule.forChild([{ path: '', component: RegistroPage }])
  ]
})
export class RegistroPageModule {}

