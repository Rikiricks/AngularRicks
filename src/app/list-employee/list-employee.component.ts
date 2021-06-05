import { Component, OnInit } from '@angular/core';
import { Employee } from '../Employee/Employee';
import { EmployeeService } from '../Employee/employee-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-employee',
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.css'],
  providers: [EmployeeService]
})
export class ListEmployeeComponent implements OnInit {

  employees: Employee[];
  constructor(private empService: EmployeeService, private route: Router) { }

  ngOnInit(): void {
    this.empService.getEmpList().subscribe((data) =>
    {
      this.employees = data;
    },
    (error) => {console.log(error); }
    );

  }

  editEmployee(id: number){
    this.route.navigate(['employees/edit', id]);
  }


}
