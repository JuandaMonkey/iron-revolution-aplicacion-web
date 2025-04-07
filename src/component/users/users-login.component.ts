import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// models 
import { UsersLogin } from '../../model/users/users-login.model';

// services
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-users-login',
  standalone: true,
  imports: [CommonModule, 
            FormsModule, 
            ReactiveFormsModule
  ],
  templateUrl: './users-login.component.html',
  styleUrl: './users-login.component.css'
})
export class UsersLoginComponent implements OnInit {
  // login
  login!: FormGroup;

  constructor (
    private AuthService: AuthService,
    private fb: FormBuilder,
    private router: Router 
  ) {}

  ngOnInit() {
    // login
    this.login = this.fb.group({
      nombre_Usuario: ['', Validators.required],
      contraseña: ['' , Validators.required]
    });
  }

  // login
  authentication() {
    if (this.login.invalid) return;

    const user: UsersLogin = {
      nombre_Usuario: this.login.value.nombre_Usuario,
      contraseña: this.login.value.contraseña
    }

    this.AuthService.login(user).subscribe ({
      next: (data) => {
        if (data.token != null) {
          localStorage.setItem("token", data.token);
          this.router.navigate(['main-dashboard']);
        } else {
          alert("Credenciales incorrectas.");
        }
      },
      error: (err) => {
        console.error("Error al obtener las credenciales.", err)
      }
    })
  }

  // logout
  logout() {
    this.AuthService.logout();
  }
}
