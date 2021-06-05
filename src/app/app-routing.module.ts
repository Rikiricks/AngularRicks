import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadingStrategy, PreloadAllModules } from '@angular/router';
import { CreateEmployeeComponent } from './create-employee/create-employee.component';
import { HomeComponent } from './home.component';
import { CustomPreloadingService } from './custom-preloading.service';
import { ModalPopUpComponent } from './modal-pop-up/modal-pop-up.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'popup', component: ModalPopUpComponent },
  { path: 'employees', data: { preload : true} , loadChildren: () => import('./Employee/employee.module').then(m => m.EmployeeModule) },
  { path: '', redirectTo: '/popup', pathMatch: 'full' },
  { path: '**', component: CreateEmployeeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: CustomPreloadingService})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
