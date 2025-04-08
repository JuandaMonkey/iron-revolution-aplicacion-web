import { Injectable } from '@angular/core';

// service api
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// models
import { Users } from '../../model/users/users.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  // url
  private url='https://localhost:44363/api/Users';

  constructor(private http: HttpClient) { }

  // put 'Asignar NIP'
  putAssignNIP(nip: string, userName: string): Observable<boolean> {
    return this.http.put<boolean>(`${this.url}/AsignarNIP?NIP=${nip}&userName=${userName}`, {})
  }

  // get 'Listar-Usuarios'
  loadUsers(rol: string, userName: string): Observable<Users[]> {
    return this.http.get<Users[]>(`${this.url}/ListarUsuarios?rol=${rol}&userName=${userName}`)
  }

  // get 'Consultar-Usuario'
  viewDetailsUser(userName: string): Observable<any> {
    return this.http.get(`${this.url}/Consultar-Usuario?userName=${userName}`)
  }

  // post 'Registrar-Usuario'
  registerUser(userData: FormData): Observable<any> {
    return this.http.post(`${this.url}/RegistrarUsuario`, userData)
  }

  // put 'Modificar-Usuario'
  modifyUsername(userName: string, newUserName: string): Observable<any> {
    return this.http.put(`${this.url}/ModificarNombreDeUsuario?userName=${userName}`, newUserName);
  }
  modifyPassword(userName: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.url}/ModificarContraseña?userName=${userName}`, newPassword);
  }

  // delete 'Eliminar-Usuario'
  deleteUser(userName: string): Observable<any> {
    return this.http.delete(`${this.url}/EliminarUsuario?userName=${userName}`)
  }
}
