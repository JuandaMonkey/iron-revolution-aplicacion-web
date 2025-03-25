import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';

// material icons
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    // material icons
    MatIconModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    // material icons
    MatIconModule
  ]
})
export class AppModule { }
