import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, FormBuilder, ReactiveFormsModule ,Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

// models
import { Memberhips } from '../../model/memberships/memberhips.model';

// services
import { MembershipsService } from '../../service/memberships/memberships.service';

@Component({
  selector: 'app-memberships-management',
  standalone: true,
  imports: [CommonModule, 
            FormsModule, 
            ReactiveFormsModule,
            RouterModule, 
            MatIconModule
  ],
  templateUrl: './memberships-management.component.html',
  styleUrl: './memberships-management.component.css'
})
export class MembershipsManagementComponent implements OnInit {
  // list of memberships
  membershipsList: Memberhips[] = [];

  // status for new membership
  isNewMembership: boolean = false;

  // modify membership
  selectedMembershipId: string | null = null;

  // membership form
  membershipForm!: FormGroup;

  constructor (
    // services
    private membershipsService: MembershipsService,
    
    // form
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    // form
    this.membershipForm = this.fb.group({
      nombre: ['', Validators.required],
      duracion: [ , [Validators.required, Validators.min(1)]]
    });

    // list of membreships
    this.loadMemberships();
  }

  // get memberships
  loadMemberships() {
    this.membershipsService.loadMemberships().subscribe ({
      next: (data) => {
        this.membershipsList = data;
      },
      error: (err) => {
        alert('Error al obtener membresías.'); 
      }
    });
  }

  // open modal
  openNewMembership() {
    this.isNewMembership = !this.isNewMembership;
    this.selectedMembershipId = null;
    this.membershipForm.reset();
  }

  // save form information
  saveMembership() {
    if (this.membershipForm.valid) {
      const formData = this.membershipForm.value;

      if (this.selectedMembershipId) {
        this.modifyMembership(this.selectedMembershipId, formData);
      } else {
        this.insertMembership(formData);
      }
    }
  }

  // insert
  insertMembership(membershipData: FormData) {
    this.membershipsService.insertMembership(membershipData).subscribe ({
      next: (data) => {
        this.loadMemberships();
        this.openNewMembership();
      }, 
      error: (err) => {
        alert('Error al insertar membresía.');
      }
    });
  }

  // modify
  modifyMembership(membershipId: string, formData: FormData) {
    this.membershipsService.modifyMembership(membershipId, formData).subscribe ({
      next: (data) => {
        this.loadMemberships();
        this.openNewMembership();
      },
      error: (err) => {
        alert('Error al modificar membresía.');
      }
    });
  }

  // delete
  deleteMembership(membershipId: string) {
    this.membershipsService.deleteMembership(membershipId).subscribe ({
      next: (data) => {
        this.loadMemberships();
      },
      error: (err) => {
        alert('Error al elimiar membresía.')
      }
    });
  }

  // set membership information
  modifyMembershipData(membership: Memberhips) {
    this.selectedMembershipId = membership.membresia_Id;

    this.membershipForm.patchValue({
      nombre: membership.nombre,
      duracion: membership.duracion
    });

    this.isNewMembership = true;
  }
}
