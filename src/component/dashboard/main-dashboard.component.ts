import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

// charts
import Chart from 'chart.js/auto';

// models
import { Branches } from '../../model/branches/branches.model';
import { BranchesCount } from '../../model/branches/branches-count.model';
import { MembershipsCount } from '../../model/memberships/memberships-count.model';

// services 
import { BranchesService } from '../../service/branches/branches.service';
import { StatisticsService } from '../../service/statistics/statistics.service';

@Component({
  selector: 'app-main-dashboard',
  standalone: true,
  imports: [CommonModule, 
            FormsModule, 
            RouterModule, 
            MatIconModule 
  ],
  templateUrl: './main-dashboard.component.html',
  styleUrl: './main-dashboard.component.css'
})
export class MainDashboardComponent implements OnInit, OnDestroy {
  // list of branches
  branch: Branches[] = [];
  // branch selected
  selectBranchId = '';

  // information
  registered_Clients: any;
  active_Clients: any;
  registered_Employees: any;
  most_Frecuented_Branch!: BranchesCount;
  branches_Count: BranchesCount[] = [];
  most_Popular_Memberships: MembershipsCount[] = [];

  private barChartInstance?: Chart<'bar', number[], string>;
  private pieChartInstance?: Chart<'pie', number[], string>;

  constructor (
    private branchService: BranchesService,
    private statisticsService: StatisticsService
  ) {}

  ngOnInit() {
    // filters
    this.getListBranches();

    this.loadStatistics();
  }

  ngOnDestroy() {
    this.destroyCharts();
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

  loadStatistics() {
    this.statisticsService.getRegisteredClients(this.selectBranchId).subscribe ( data => {
      this.registered_Clients = data;
    });
    this.statisticsService.getActiveClients(this.selectBranchId).subscribe ( data => {
      this.active_Clients = data;
    });
    this.statisticsService.getRegisteredEmployees(this.selectBranchId).subscribe ( data => {
      this.registered_Employees = data;
    });
    this.statisticsService.getBranchesCount().subscribe ( data => {
      this.branches_Count = data;
      this.updateBarChart();
    });
    this.statisticsService.getMostFrecuentedBranch(this.selectBranchId).subscribe ( data => {
      this.most_Frecuented_Branch = data;
    });
    this.statisticsService.getMostPopularMemberships(this.selectBranchId).subscribe ( data => {
      this.most_Popular_Memberships = data;
      this.initPieChart();
    } )
  }

  // apply filter
  onBranchChange(branchId: string) {
    this.selectBranchId = branchId;
    this.loadStatistics();
  }

  // clean filters
  cleanFilters() {
    this.selectBranchId = '';
  }

  private destroyCharts() {
    if (this.barChartInstance) {
      this.barChartInstance.destroy();
      this.barChartInstance = undefined;
    }
    if (this.pieChartInstance) {
      this.pieChartInstance.destroy();
      this.pieChartInstance = undefined;
    }
  }

  private updateBarChart() {
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
    
    if (this.barChartInstance) {
      this.barChartInstance.destroy();
    }

    const labels = this.branches_Count.map(branch => branch.ubicacion);
    const data = this.branches_Count.map(branch => branch.conteo);

    this.barChartInstance = new Chart<'bar', number[], string>(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Visitas por Sucursal',
          data: data,
          backgroundColor: [
            '#2D2D2D', 
            '#444444', 
            '#666666', 
            '#888888', 
            '#AAAAAA', 
            '#DEDEDE'  
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Número de Visitas'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Sucursales'
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `${context.dataset.label}: ${context.raw}`;
              }
            }
          }
        }
      }
    });
  }

  private initPieChart() {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    
    if (this.pieChartInstance) {
      this.pieChartInstance.destroy();
    }

    const labels = this.most_Popular_Memberships.map(m => m.nombre);
    const data = this.most_Popular_Memberships.map(m => m.conteo);

    this.pieChartInstance = new Chart<'pie', number[], string>(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Membresías populares',
          data: data,
          backgroundColor: [
            '#2D2D2D', 
            '#444444', 
            '#666666', 
            '#888888', 
            '#AAAAAA', 
            '#DEDEDE'  
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw as number;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  } 
}
