import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { UsersLoginComponent } from '../component/users/users-login.component';
import { MainDashboardComponent } from '../component/dashboard/main-dashboard.component';
import { StatisticsOverviewComponent } from '../component/statistics/statistics-overview.component';
import { ClientsManagementComponent } from '../component/clients/clients-management.component';
import { MembershipsManagementComponent } from '../component/memberships/memberships-management.component';
import { ExercisesManagementComponent } from '../component/exercises/exercises-management.component';
import { EmployeesManagementComponent } from '../component/employees/employees-management.component';
import { BranchesManagementComponent } from '../component/branches/branches-management.component';
import { UsersManagementComponent } from '../component/users/users-management.component';

import { authGuard } from '../custom/auth.guard';
import { roleGuard } from '../custom/role.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component:UsersLoginComponent},
    { path: 'main-dashboard', component: MainDashboardComponent, canActivate:[authGuard]},
    { path: 'statistics-overview', component: StatisticsOverviewComponent, canActivate:[authGuard] },
    { path: 'clients-management', component: ClientsManagementComponent, canActivate:[authGuard] },
    { path: 'memberships-management', component: MembershipsManagementComponent, canActivate:[authGuard] },
    { path: 'exercises-management', component: ExercisesManagementComponent, canActivate:[authGuard] },
    { path: 'employees-management', component: EmployeesManagementComponent, canActivate:[authGuard, roleGuard], data: { roles: ['Administrador'] } },
    { path: 'branches-management', component: BranchesManagementComponent, canActivate:[authGuard, roleGuard], data: { roles: ['Administrador'] } },
    { path: 'users-management', component: UsersManagementComponent, canActivate:[authGuard, roleGuard],  data: { roles: ['Administrador'] } }
];
