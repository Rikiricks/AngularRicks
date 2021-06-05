import { OnInit, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Employee } from './Employee';
import { delay, retry, catchError } from 'rxjs/operators';
import { CATCH_STACK_VAR } from '@angular/compiler/src/output/output_ast';

@Injectable()
export class EmployeeService {
    baseUrl = 'http://localhost:3000/employees';
    constructor(private client: HttpClient) {

    }

    getEmpList(): Observable<Employee[]>{
        return this.client.get<Employee[]>(this.baseUrl).
        pipe(retry(1), catchError(this.handleError));
    }

    updateEmployee(employee: Employee): Observable<void> {
        return this.client.put<void>(`${this.baseUrl}/${employee.Id}`, employee, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        }).pipe(catchError(this.handleError));
      }

      addEmployee(employee: Employee): Observable<Employee> {
        return this.client.post<Employee>(`${this.baseUrl}`, employee, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        }).pipe(catchError(this.handleError));
      }


    handleError(error) {
        let errorMsj = '';
        if (error.error instanceof ErrorEvent) {
            errorMsj = `Client-side error: ${error.error.message}`;
        }
        else {
            errorMsj = `Error-code: ${error.status}, message: ${error.message}`;
        }
        return throwError(errorMsj);
    }

}
