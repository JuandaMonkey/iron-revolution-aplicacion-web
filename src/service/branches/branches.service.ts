import { Injectable } from '@angular/core';

// service api
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// models
import { Branches } from '../../model/branches/branches.model';

@Injectable({
  providedIn: 'root'
})
export class BranchesService {

  // url 
  private url='https://localhost:44363/api/Branches/Listar-Sucursales';

  constructor(private http: HttpClient) { }

  // get 'Listar-Sucursales'
  getListBranches(): Observable<Branches[]> {
    return this.http.get<Branches[]>(this.url)
  }
}
