import { Injectable } from '@angular/core';

// services api
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// models
import { BranchesCount } from '../../model/branches/branches-count.model';
import { MembershipsCount } from '../../model/memberships/memberships-count.model';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { BranchesManagementComponent } from '../../component/branches/branches-management.component';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  // url
  private url="https://localhost:44363/api/Statistics";

  constructor(private http: HttpClient) { }

  // get 'Clientes-Registrados'
  getRegisteredClients(branchId: string): Observable<any> {
    return this.http.get(`${this.url}/ClientesRegistrados?branchId=${branchId}`)
  }

  // get 'Clientes-Activos'
  getActiveClients(branchId: string): Observable<any>  {
    return this.http.get(`${this.url}/ClientesActivos?branchId=${branchId}`)
  }

  // get 'Empleados-Registrados'
  getRegisteredEmployees(branchId: string): Observable<BranchesCount[]> {
    return this.http.get<BranchesCount[]>(`${this.url}/EmpleadosRegistrados?branchId=${branchId}`)
  }

  // get 'Sucursales'
  getBranchesCount(): Observable<any> {
    return this.http.get(`${this.url}/Sucursales`)
  }

  // get 'Sucursal-Más-Visitada'
  getMostFrecuentedBranch(branchId: string): Observable<BranchesCount> {
    return this.http.get<BranchesCount>(`${this.url}/SucursalMasVisitada?branchId=${branchId}`)
  }

  // get 'Membresías-Más-Populares'
  getMostPopularMemberships(branchId: string): Observable<MembershipsCount[]> {
    return this.http.get<MembershipsCount[]>(`${this.url}/MembresiasMasPopulares?branchId=${branchId}`)
  }
}
