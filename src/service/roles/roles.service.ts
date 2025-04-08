import { Injectable } from '@angular/core';

// service api
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// models
import { Roles } from '../../model/roles/roles.model';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  // url
  private url='https://localhost:44363/api/Roles';

  constructor(private http: HttpClient) { }

  // get 'Listar-Roles'
  loadRoles(): Observable<Roles[]> {
    return this.http.get<Roles[]>(`${this.url}/Listar-Roles`)
  }
}
