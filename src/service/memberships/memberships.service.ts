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
  private url='https://localhost:44363/api/Memberships/ListarMembresias';

  constructor(private http: HttpClient) { }

  // get 'Listar-Membresías'
  getListMemberships(): Observable<Memberhips[]> {
    return this.http.get<Memberhips[]>(this.url)
  }
}
