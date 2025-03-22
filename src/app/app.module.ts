import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';

// material icons
import { MatIconModule } from '@angular/material/icon';

// routes
import { AppRoutingModule } from './app.routes';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    // router
    AppRoutingModule,
    // material icons
    MatIconModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    // router
    AppRoutingModule,
    // material icons
    MatIconModule
  ]
})
export class AppModule { }
