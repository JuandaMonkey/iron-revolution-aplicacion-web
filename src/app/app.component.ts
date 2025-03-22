import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

// modules
import { AppModule } from './app.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppModule, 
            RouterOutlet, 
            CommonModule, 
            MatIconModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // siderbar
  isOpen = true; 

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
}
