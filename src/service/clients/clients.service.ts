import { Injectable } from '@angular/core';

// service api
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// models
import { Clients } from '../../model/clients/clients.model';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  // url
  private url='https://localhost:44363/api/Clients';
  
  constructor(private http: HttpClient) { }

  // get 'Listar-Clientes'
  getListClients(memberhipId: string | null, startDay: string, endDay: string): Observable<Clients[]> {
    return this.http.get<Clients[]>(`${this.url}/ListarClientes?membershipId=${memberhipId}&startDay=${startDay}&endDay=${endDay}`)
  }

  // get 'Consultar-Cliente-Por-NIP'
  getGetClientByNIP(nip: string | null): Observable<Clients> {
    return this.http.get<Clients>(`${this.url}/ConsultarClientePorNIP?NIP=${nip}`)
  }
}
