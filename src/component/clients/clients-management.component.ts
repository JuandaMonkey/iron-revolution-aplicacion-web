import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

// models
import { Memberhips } from '../../model/memberships/memberhips.model';
import { Clients } from '../../model/clients/clients.model';

// services
import { MembershipsService } from '../../service/memberships/memberships.service';
import { ClientsService } from '../../service/clients/clients.service';

@Component({
  selector: 'app-clients-management',
  standalone: true,
  imports: [CommonModule, 
            FormsModule, 
            RouterModule, 
            MatIconModule
  ],
  templateUrl: './clients-management.component.html',
  styleUrl: './clients-management.component.css'
})
export class ClientsManagementComponent implements OnInit {
  // list of memberships
  membership: Memberhips[] = [];
  // membership selected
  selectMembershipId: string | null = null;

  // list of clients
  clients: Clients[] = [];
  // client nip
  clientNIP: string | null = null;

  // start and end date
  selectStartDay!: string;
  selectEndDay!: string;
  selectMaxDate!: string;

  constructor (
    private membershipsService: MembershipsService,
    private clientsService: ClientsService
  ) {}

  ngOnInit() {
    // filters
    this.getListMemberships();
    
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    this.selectMaxDate = this.formatDate(today);
    this.selectStartDay = this.formatDate(sevenDaysAgo); 
    this.selectEndDay = this.formatDate(today); 

    // table
    this.getListClients(this.selectMembershipId, this.selectStartDay, this.selectEndDay);
  }

  // changes
  onChange(){
    this.getListClients(this.selectMembershipId, this.selectStartDay, this.selectEndDay);
  }

  // get memberships
  getListMemberships() {
    this.membershipsService.getListMemberships().subscribe({
      next: (data) => {
        console.log('Datos recibidos: ', data);
        this.membership = data;
      },
      error: (err) => {
        console.error('Error al obtener membresías:', err); 
      }
    })
  }

  // format date for input 'yyyy-mm-dd'
  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  // convert dd-mm-yyyy to yyyy-mm-dd for API 
  private convertToYYYYMMDD(date: string): string {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`;
  }

  // get clients
  getListClients(membershipId: string | null, selectStartDay: string, selectEndDay: string) {
    const memberhip = membershipId ? membershipId : "";
    const StartDay = this.convertToYYYYMMDD(selectStartDay);
    const EndDay = this.convertToYYYYMMDD(selectEndDay);
    this.clientsService.getListClients(memberhip, StartDay, EndDay).subscribe({
      next: (data) => {
        console.log('Datos recibidos: ', data);
        this.clients = data;
      }, 
      error: (err) => {
        console.error('Error al obtener clientes: ', err);
      }
    })
  }

  // get client by nip
  getClientByNIP(clientNIP: string | null) {
    if (!clientNIP || clientNIP.trim() === '') {
      this.getListClients(this.selectMembershipId, this.selectStartDay, this.selectEndDay);
      return;
    }

    this.clientsService.getGetClientByNIP(clientNIP).subscribe ({
      next: (data) => {
        console.log('Datos recibidos: ', data);
        this.clients = data ? [data] : [];
      }, 
      error: (err) => {
        console.error('Error al obtener cliente: ', err)
      }
    })
  }

  // clean filters
  cleanFilters() {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    this.selectMembershipId = null;
    this.selectStartDay = this.formatDate(sevenDaysAgo);
    this.selectEndDay = this.formatDate(today);

    this.clientNIP = null;

    this.getListClients(this.selectMembershipId, this.selectStartDay, this.selectEndDay);
  }
}
