import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

// models
import { Branches } from '../../model/branches/branches.model';
import { ActivityCenter } from '../../model/activity_center/activity-center.model';

// services 
import { BranchesService } from '../../service/branches/branches.service';
import { ActivityCenterService } from '../../service/activity-center/activity-center.service';

@Component({
  selector: 'app-statistics-overview',
  standalone: true,
  imports: [CommonModule, 
            FormsModule, 
            RouterModule, 
            MatIconModule 
  ],
  templateUrl: './statistics-overview.component.html',
  styleUrl: './statistics-overview.component.css'
})
export class StatisticsOverviewComponent implements OnInit {
  // list of branches
  branch: Branches[] = [];
  // branch selected
  selectBranchId: string | null = null;

  // start and end date
  selectStartDay!: string;
  selectEndDay!: string;
  selectMaxDate!: string;

  // list of activity center
  activityCenter: ActivityCenter[] = []; 

  constructor (
    private branchService: BranchesService,
    private activityCenterService: ActivityCenterService
  ) {}

  ngOnInit() {
    // filters
    this.getListBranches();

    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    this.selectMaxDate = this.formatDate(today);
    this.selectStartDay = this.formatDate(sevenDaysAgo); 
    this.selectEndDay = this.formatDate(today); 

    this.getListActivityCenter(this.selectBranchId, this.selectStartDay, this.selectEndDay);
  }

  // changes
  onChange(){
    this.getListActivityCenter(this.selectBranchId, this.selectStartDay, this.selectEndDay)
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

  // get activity center
  getListActivityCenter(branchId: string | null, selectStartDay: string, selectEndDay: string) {
    const branch = branchId ? branchId : "";
    const StartDay = this.convertToYYYYMMDD(selectStartDay);
    const EndDay = this.convertToYYYYMMDD(selectEndDay);
    this.activityCenterService.getListActivityCenter(branch, StartDay, EndDay).subscribe({
      next: (data) => {
        console.log('Datos recibidos: ', data);
        this.activityCenter = data;
      },
      error: (err) => {
        console.error('Error al obtener centro de actividades: ', err); 
      }
    })
  }

  // clean filters
  cleanFilters() {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    this.selectBranchId = null;
    this.selectStartDay = this.formatDate(sevenDaysAgo);
    this.selectEndDay = this.formatDate(today);

    this.getListActivityCenter(this.selectBranchId, this.selectStartDay, this.selectEndDay);
  }
}
