import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';
// import { ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
// import { EmployeeModule } from './Employee/employee.module';

import { AppComponent } from './app.component';

import { EmployeeService } from './Employee/employee-service';
import { HomeComponent } from './home.component';
import { ModalPopUpComponent } from './modal-pop-up/modal-pop-up.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ModalPopUpComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,    //EmployeeModule,
    // ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [EmployeeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
