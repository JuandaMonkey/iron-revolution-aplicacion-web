import { Injectable } from '@angular/core';

// service api
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// models
import { Memberhips } from '../../model/memberships/memberhips.model';

@Injectable({
  providedIn: 'root'
})
export class MembershipsService {
  // url
  private url='https://localhost:44363/api/Memberships';

  constructor(private http: HttpClient) { }

  // get 'Listar-Membresías'
  loadMemberships(): Observable<Memberhips[]> {
    return this.http.get<Memberhips[]>(`${this.url}/ListarMembresias`)
  }

  // post 'Insertar-Membresía'
  insertMembership(formData: FormData): Observable<Memberhips> {
    return this.http.post<Memberhips>(`${this.url}/InsertarMembresia`, formData)
  }

  // put 'Modificar-Membresía'
  modifyMembership(nip: string, formData: FormData): Observable<Memberhips> {
    return this.http.put<Memberhips>(`${this.url}/ModificarMembresia?membershipID=${nip}`, formData)
  }

  // delete 'Eliminar-Membresía'
  deleteMembership(nip: string): Observable<Memberhips> {
    return this.http.delete<Memberhips>(`${this.url}/EliminarMembresia?membershipID=${nip}`)
  }

  // put 'Asignar-Membresía'
  putAssignMembership(nip: string, membershipId: string): Observable<Memberhips> {
    return this.http.put<Memberhips>(`${this.url}/AsignarMembresia?NIP=${nip}&membershipID=${membershipId}`, {})
  }
}
