import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { RouterModule, Router } from '@angular/router';

// auth
import { AuthService } from '../service/auth/auth.service';

// models
import { Users } from '../model/users/users.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, 
    CommonModule, 
    MatIconModule,
    RouterModule
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  // siderbar
  isOpen = true; 
  // logout
  isOpenLogout = false;

  // session
  user: Users | null = null; 
  isAdmin!: boolean;

  constructor (
    public router: Router,
    private authServices: AuthService
  ) {}

  ngOnInit() {
    this.authServices.currentUser$.subscribe(user => {
      this.user = user;
      this.isAdmin = this.authServices.hasRole('Administrador');
    });
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  toggleLogout() {
    this.isOpenLogout = this.isOpenLogout;
  }

  logout() {
    this.authServices.logout();
  }
}
