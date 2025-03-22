import { NgModule } from '@angular/core';
import { provideRouter, RouterModule, Routes } from '@angular/router';

// components
import { MainDashboardComponent } from '../component/dashboard/main-dashboard.component';
import { StatisticsOverviewComponent } from '../component/statistics/statistics-overview.component';
import { ClientsManagementComponent } from '../component/clients/clients-management.component';
import { MembershipsManagementComponent } from '../component/memberships/memberships-management.component';
import { ExercisesManagementComponent } from '../component/exercises/exercises-management.component';
import { EmployeesManagementComponent } from '../component/employees/employees-management.component';
import { BranchesManagementComponent } from '../component/branches/branches-management.component';
import { UsersManagementComponent } from '../component/users/users-management.component';

export const routes: Routes = [
    { path: 'main-dashboard', component: MainDashboardComponent},
    { path: 'statistics-overview', component: StatisticsOverviewComponent},
    { path: 'clients-management', component: ClientsManagementComponent},
    { path: 'memberships-management', component: MembershipsManagementComponent },
    { path: 'exercises-management', component: ExercisesManagementComponent },
    { path: 'employees-management', component: EmployeesManagementComponent },
    { path: 'branches-management', component: BranchesManagementComponent },
    { path: 'users-management', component: UsersManagementComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }