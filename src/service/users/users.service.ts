import { Injectable } from '@angular/core';

// service api
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}
