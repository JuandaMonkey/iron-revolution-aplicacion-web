import { Injectable } from '@angular/core';

// service api
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// models
import { Clients } from '../../model/clients/clients.model';
import { NewClient } from '../../model/clients/new-client.model';
import { ReturnStatement } from '@angular/compiler';

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
  getClientByNIP(nip: string | null): Observable<Clients> {
    return this.http.get<Clients>(`${this.url}/ConsultarClientePorNIP?NIP=${nip}`)
  }

  // post 'Registrar-Cliente'
  postRegisterClient(formData: FormData): Observable<Clients> {
    return this.http.post<Clients>(`${this.url}/RegistrarCliente`, formData)
  }

  // put 'Modificar-Cliente'
  putModifyClient(nip: string, formData: FormData): Observable<Clients> {
    return this.http.put<Clients>(`${this.url}/ModificarCliente?NIP=${nip}`, formData)
  }

  // delete 'Eliminar-Cliente'
  deleteDeleteClient(nip: string): Observable<Clients> {
    return this.http.delete<Clients>(`${this.url}/EliminarCliente?NIP=${nip}`)
  }
}
