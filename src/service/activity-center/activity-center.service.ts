import { Injectable } from '@angular/core';

// service api
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// models
import { ActivityCenter } from '../../model/activity_center/activity-center.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityCenterService {

  // url
  private url='https://localhost:44363/api/Activity_Center/ListarCentroDeActividad';


  constructor(private http: HttpClient) { }

  // get 'Listar-Centro-De-Actividad'
  getListActivityCenter(branchId: string | null, startDay: string, endDay: string): Observable<ActivityCenter[]> {
    return this.http.get<ActivityCenter[]>(`${this.url}?branchId=${branchId}&startDay=${startDay}&endDay=${endDay}`)
  }
}
