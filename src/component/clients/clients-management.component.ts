import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, FormBuilder, ReactiveFormsModule ,Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

// models
import { Memberhips } from '../../model/memberships/memberhips.model';
import { Branches } from '../../model/branches/branches.model';
import { Clients } from '../../model/clients/clients.model';
import { NewClient } from '../../model/clients/new-client.model';

// services
import { MembershipsService } from '../../service/memberships/memberships.service';
import { BranchesService } from '../../service/branches/branches.service';
import { ClientsService } from '../../service/clients/clients.service';

@Component({
  selector: 'app-clients-management',
  standalone: true,
  imports: [CommonModule, 
            FormsModule, 
            ReactiveFormsModule,
            RouterModule, 
            MatIconModule
  ],
  templateUrl: './clients-management.component.html',
  styleUrl: './clients-management.component.css'
})
export class ClientsManagementComponent implements OnInit {
  // list of memberships
  membership: Memberhips[] = [];
  selectMembershipId: string | null = null;

  // list of branches
  branch: Branches[] = [];
  selectBranchId: string | null = null;

  // list of clients
  clients: Clients[] = [];
  clientNIP: string | null = null;

  // client data
  client: NewClient | null = null;
  // new client
  newClient: boolean = false;
  // checkbox
  haveUsername: boolean = false;
  // client form
  clientForm!: FormGroup;
  // client nip for update
  updateClientNIP: string | null = null;

  // start and end date
  selectStartDay!: string;
  selectEndDay!: string;
  selectMaxDate!: string;

  constructor (
    // services
    private membershipsService: MembershipsService,
    private branchService: BranchesService,
    private clientsService: ClientsService,

    // form
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    // filters
    this.getListMemberships();
    this.getListBranches();
    
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    this.selectMaxDate = this.formatDate(today);
    this.selectStartDay = this.formatDate(sevenDaysAgo); 
    this.selectEndDay = this.formatDate(today);

    // form
    this.clientForm = this.fb.group({
      foto: [null],
      nombre_Completo: ['', Validators.required],
      celular: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      observacion: [''],
      sucursal_Id: ['', Validators.required] 
    });

    // table
    this.getListClients(this.selectMembershipId, this.selectStartDay, this.selectEndDay);
  }

  // changes
  onChange(){
    this.getListClients(this.selectMembershipId, this.selectStartDay, this.selectEndDay);
  }

  // open modal client
  openClient() {
    this.newClient = !this.newClient;
    this.clientForm.reset();
    this.updateClientNIP = null;
  }

  // open modal client
  checkboxHaveUsername() {
    this.haveUsername = !this.haveUsername;
  }

  // foto selected
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        this.clientForm.patchValue({
          foto: base64String
        });
      };
    }
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

  // get branches
  getListBranches() {
    this.branchService.getListBranches().subscribe({
      next: (data) => {
        console.log('Datos recibidos: ', data);
        this.branch = data;
      },
      error: (err) => {
        console.error('Error al obtener sucursales:', err); 
      }
    });
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

    this.clientsService.getClientByNIP(clientNIP).subscribe ({
      next: (data) => {
        if (data.foto) {
          if (data.foto instanceof ArrayBuffer || data.foto instanceof Uint8Array) {
            const base64 = btoa(String.fromCharCode(...new Uint8Array(data.foto)));
            data.foto = 'data:image/jpeg;base64,' + base64;
        } else if (typeof data.foto === 'string') {
          data.foto = 'data:image/jpeg;base64,' + data.foto;
        }
      }
        console.log('Datos recibidos: ', data);
        this.clients = data ? [data] : [];
      }, 
      error: (err) => {
        console.error('Error al obtener cliente: ', err)
      }
    })
  }

  postRegisterClient(formData: FormData) {
    this.clientsService.postRegisterClient(formData).subscribe ({
      next: (data) => {
        console.log('Datos recibidos: ', data);
        this.getClientByNIP(data.nip);
        this.openClient();
      },
      error: (err) => {
        console.error('Error al insertar cliente: ', err);
      }
    })
  }

  saveClientData() {
    if (this.clientForm.valid) {
      const formValues = this.clientForm.value;
      if (this.updateClientNIP != null) {
      } else {
        this.postRegisterClient(formValues)
      }
    }
  }

  saveUpdateClient(client: Clients) {
    this.updateClientNIP = client.nip;
    this.clientForm.patchValue({
      foto: client.foto,
      nombre_Completo: client.nombre_Completo,
      celular: client.celular,
      observacion: client.observacion,
      branch: client.sucursal.sucursal_Id
    });
    this.openClient();
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
