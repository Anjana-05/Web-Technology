import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { VisitorCheckinComponent } from './components/visitor-checkin/visitor-checkin.component';
import { VisitorCheckoutComponent } from './components/visitor-checkout/visitor-checkout.component'; 
import { AdminComponent } from './components/admin/admin.component'; 
import { AdminLoginComponent } from './components/admin-login/admin-login.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'checkin', component: VisitorCheckinComponent },
  { path: 'checkout', component: VisitorCheckoutComponent },
  { path: 'admin-dashboard', component: AdminComponent },
  { path: 'admin-login', component: AdminLoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }