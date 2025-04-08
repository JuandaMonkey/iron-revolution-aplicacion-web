import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, FormBuilder, ReactiveFormsModule ,Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

// models 
import { Users } from '../../model/users/users.model';
import { UsersEmployeeDetails } from '../../model/users/users-employee-details.model';
import { UsersClientDetails } from '../../model/users/users-client-details.model';
import { Roles } from '../../model/roles/roles.model';

// services
import { UsersService } from '../../service/users/users.service';
import { RolesService } from '../../service/roles/roles.service';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule, 
            FormsModule, 
            ReactiveFormsModule,
            RouterModule, 
            MatIconModule
  ],
  templateUrl: './users-management.component.html',
  styleUrl: './users-management.component.css'
})
export class UsersManagementComponent implements OnInit {
  // list of users
  usersList: Users[] = [];
  selectedUserName: string = '';

  // list of roles
  rolesList: Roles[] = [];
  selectedUserRol: string = '';

  // open details modal
  isOpenDetails: boolean = false;
  userClient: UsersClientDetails | null = null;
  userEmployee: UsersEmployeeDetails | null = null;

  // status for new user
  isNewUser: boolean = false;
  haveNIP: boolean = false;

  // modify user
  selectedUserUsername: string | null = null;
  isModifyUser: boolean = false;

  // user form
  userForm!: FormGroup;
  userModifyForm!: FormGroup;

  constructor (
    // services
    private usersService: UsersService,
    private rolesService: RolesService,
    // form
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      nombre_usuario: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(12)
      ]],
      contraseña: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(12),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)[A-Za-z0-9áéíóúÁÉÍÓÚñÑ]{8,12}$/)
      ]],
      rol: ['', Validators.required],
      nip: ['']
    });
    this.userModifyForm = this.fb.group({
      nombre_usuario: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(12)
      ]]
    });
  
    // list of users
    this.loadUsers(this.selectedUserRol, this.selectedUserName);
    // list of roles
    this.loadRoles();
  }

  onChange() {
    this.loadUsers(this.selectedUserRol ,this.selectedUserName);
  }

  // get users
  loadUsers(rol: string, userName: string) {
    this.usersService.loadUsers(rol, userName).subscribe ({
      next: (data) => {
        this.usersList = data;
      },
      error: (err) => {
        alert('Error al obtener usuarios.');
      }
    });
  }

  // get roles
  loadRoles() {
    this.rolesService.loadRoles().subscribe ({
      next: (data) => {
        this.rolesList = data;
      },
      error: (err) => {
        alert('Error al obtener los roles.')
      }
    })
  }

  // open modal
  openNewUser() {
    this.isModifyUser = !this.isModifyUser;
    this.selectedUserUsername = null;
    this.userForm.reset();
  }

  // save form information
  saveUser() {
    if (this.userForm.valid) {
      const formData = this.userForm.value;

      if (this.selectedUserUsername && this.userModifyForm.valid) {
        const newUser = formData.get('nombre_usuario');
        this.modifyUsername(this.selectedUserName, newUser)
      } else {
        this.registerUser(formData);
      }
    }
  }

  checkboxHaveNIP() {
    this.haveNIP = !this.haveNIP;
    const nip = this.userForm.get('nip');

    if (!nip) {
      alert('Ingresar NIP.'); return;
    }

    if (this.haveNIP) {
      nip.setValidators([Validators.required]);
      nip.enable();
    } else {
      nip.clearValidators();
      nip.setValue(null);
      nip.disable();
    }
    nip.updateValueAndValidity();
  }

  // register
  registerUser(userData: FormData) {
    this.usersService.registerUser(userData).subscribe ({
      next: (data) => {
        this.openNewUser();
        this.loadUsers(data.usuario.rol, data.usuario.nombre_Usuario);
        this.loadRoles();
      }, 
      error: (err) => {
        alert('Error al insertar usuario.');
      }
    });
  }

  openModifyUser() {
    this.isModifyUser = !this.isModifyUser;
    this.selectedUserUsername = null;
    this.userForm.reset();
  }

  // set user information
  modifyUserData(user: Users) {
    this.selectedUserUsername = user.nombre_Usuario;

    this.userModifyForm.patchValue({
      nombre_usuario: user.nombre_Usuario
    });

    this.isModifyUser = true;
  }

  // modify
  modifyUser(username: string, newUsername: string) {
    this.modifyUsername(username, newUsername);
    this.openNewUser();
  }

  modifyUsername(username: string, newUsername: string) {
    this.usersService.modifyUsername(username, newUsername).subscribe ({
      next: (data) => {
        alert('Usuario modificado correctamente.');
      },
      error: (err) => {
        alert('Error al modificar usuario.');
      }
    });
  }

  // open modal
  openDetails() {
    this.isOpenDetails = !this.isOpenDetails;
  }

  // details
  viewUserDetails(userName: string, rol: string) {
    this.usersService.viewDetailsUser(userName).subscribe ({
      next: (data) => {
        this.userClient = null;
        this.userEmployee = null;
        if (rol == 'Cliente') {
          this.userClient = data;
        } else {
          this.userEmployee = data
        }
        this.openDetails()
      },
      error: (err) => {
        alert('Error al mostrar detalles.')
      }
    });
  }

  // delete
  deleteUser(userName: string) {
    this.usersService.deleteUser(userName).subscribe ({
      next: (data) => {
        this.loadUsers(this.selectedUserRol, this.selectedUserName);
      },
      error: (err) => {
        alert('Error al eliminar usuario.')
      }
    });
  }

  cleanFilters() {
    this.selectedUserRol = '';
    this.selectedUserName = '';

    this.selectedUserUsername = null;

    this.loadUsers(this.selectedUserRol, this.selectedUserName);
  }
}
