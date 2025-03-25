import { Injectable } from '@angular/core';

// service api
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// models
import { Dashboard } from '../../model/dashboard/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  // url
  private url='https://localhost:44363/api/Dashboard/InformacionDashboard';
  
  constructor(private http: HttpClient) { }

  // get 'Información-Dashboard'
  getInformationDashboard(branchId: string = 'Todos'): Observable<Dashboard> {
    return this.http.get<Dashboard>(`${this.url}/${branchId}`)
  } 
}
