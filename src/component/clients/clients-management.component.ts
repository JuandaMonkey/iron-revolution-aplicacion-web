import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { UsersService } from '../../service/users/users.service';

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

  // assign membership
  isAssignMembership: boolean = false;
  assignMembershipForm!: FormGroup; 

  // start and end date
  selectStartDay!: string;
  selectEndDay!: string;
  selectMaxDate!: string;

  constructor (
    // services
    private membershipsService: MembershipsService,
    private branchService: BranchesService,
    private clientsService: ClientsService,
    private usersService: UsersService,

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
      observacion: [null],
      sucursal_Id: ['', Validators.required],
      usuario: [{value: null, disabled: true}]
    });

    // table
    this.getListClients(this.selectMembershipId, this.selectStartDay, this.selectEndDay);
  }

  // changes
  onChange(){
    this.getListClients(this.selectMembershipId, this.selectStartDay, this.selectEndDay);
  }

  openAssignMembershipModal() {
    this.isAssignMembership = !this.isAssignMembership;
  }
  
  openAssignMembership(client: Clients) {
    this.isAssignMembership = !this.isAssignMembership;
    this.updateClientNIP = client.nip;

    const today = new Date();
    const startDate = this.formatDate(today);

    this.assignMembershipForm = this.fb.group({
      membershipId: ['', Validators.required],
      startDate: [{value: startDate, disabled: true}],
      endDate: [{value: '', disabled: true}] 
    });

    this.assignMembershipForm.get('membershipId')?.valueChanges.subscribe(membershipId => {
      const selectedMembership = this.membership.find(m => m.membresia_Id === membershipId);
      if (selectedMembership) {
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + selectedMembership.duracion);
        this.assignMembershipForm.get('endDate')?.setValue(this.formatDate(endDate));
      }
    });
  }

  assignMembership() {
    if (this.assignMembershipForm.valid && this.updateClientNIP) {
      const membershipId = this.assignMembershipForm.get('membershipId')?.value;
      const endDay = this.assignMembershipForm.get('endDate')?.value;

      this.membershipsService.putAssignMembership(this.updateClientNIP, membershipId).subscribe({
        next: (data) => {
          console.log('Membresía asignada:', data);
          this.isAssignMembership = false;
          this.updateClientNIP = null;
          this.getListClients(this.selectMembershipId, this.selectStartDay, endDay);
        },
        error: (err) => {
          alert(err.error?.message || 'Error al asignar membresía');
          console.error('Error al asignar membresía:', err);
        }
      });
    }    
  }

  // open modal client
  openClient() {
    this.newClient = !this.newClient;
    this.clientForm.reset();
    this.updateClientNIP = null;
  }

  checkboxHaveUsername() {
    this.haveUsername = !this.haveUsername;
    const user = this.clientForm.get('usuario');
    
    if (!user) {
      alert('Ingresar usuario'); return;
    }

    if (this.haveUsername) {
      user.setValidators([Validators.required]);
      user.enable();
    } else {
      user.clearValidators();
      user.setValue(null);
      user.disable();
    }
    user.updateValueAndValidity();
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
    this.membershipsService.loadMemberships().subscribe({
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
        alert(err.error?.message || 'Error al obtener cliente.');
        console.error('Error al obtener cliente: ', err)
      }
    })
  }

  postRegisterClient(formData: FormData) {
    this.clientsService.postRegisterClient(formData).subscribe ({
      next: (data) => {
        console.log('Datos recibidos: ', data);
        if (this.haveUsername == true) {
          const usuario = this.clientForm.get('usuario')?.value;
          this.putAssignNIP(data.nip, usuario);
        }
        this.getClientByNIP(data.nip);
        this.openClient();
      },
      error: (err) => {
        alert(err.error?.message || 'Error al registrar cliente.');
        console.error('Error al insertar cliente: ', err);
      }
    })
  }

  putAssignNIP(nip: string, userName: string) {
    this.usersService.putAssignNIP(nip, userName).subscribe ({
      error: (err) => {
        alert(err.error?.message || 'Error al asignar NIP.');
        console.error('Error al asignar NIP: ', err);
      }
    })
  }

  putModifyClient(clientNIP: string, formData: FormData) {
    this.clientsService.putModifyClient(clientNIP, formData).subscribe ({
      next: (data) => {
        console.log('Datos recibidos: ', data);
        if (this.haveUsername == true) {
          const usuario = this.clientForm.get('usuario')?.value;
          this.putAssignNIP(data.nip, usuario);
        }
        this.getClientByNIP(data.nip);
        this.openClient();
      },
      error: (err) => {
        alert(err.error?.message || 'Error al modificar cliente.');
        console.error('Error al modificar cliente: ', err);
      }
    })
  }

  deleteDeleteClient(clientNIP: string) {
    this.clientsService.deleteDeleteClient(clientNIP).subscribe ({
      next: (data) => {
        console.log('Datos recibidos: ', data);
        this.getListClients(this.selectMembershipId, this.selectStartDay, this.selectEndDay);
      },
      error: (err) => {
        console.error('Error al eliminar cliente: ', err);
      }
    })
  }

  saveClientData() {
    if (this.clientForm.valid) {
      const formValues = this.clientForm.value;
      if (this.updateClientNIP != null) {
        this.putModifyClient(this.updateClientNIP, formValues);
      } else {
        this.postRegisterClient(formValues);
      }
    }
  }

  saveUpdateClient(client: Clients) {
    this.updateClientNIP = client.nip;

    this.clientForm.reset();
    this.clientForm.patchValue({
      foto: client.foto,
      nombre_Completo: client.nombre_Completo,
      celular: client.celular,
      observacion: client.observacion,
      sucursal_Id: client.sucursal.sucursal_Id
    });

    if (this.haveUsername) {
      const user = this.clientForm.get('usuario');
      if (user) {
        user.enable();
        user.setValidators([Validators.required]);
        user.updateValueAndValidity();
      }
    }

    this.newClient = true;
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
