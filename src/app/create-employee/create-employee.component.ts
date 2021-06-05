import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { CustomValidator } from '../CustomValidator';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../Employee/employee-service';
import { Employee, Skills } from '../Employee/Employee';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {

  employeeForm: FormGroup;
  employee: Employee;

  validationMsjs = {
    fullName: {
      required: 'Full name is required.',
      minlength: 'Min length is 3',
      maxlength: 'Max length is 10'
    },
    emailGroup: {
      emailMismatch: 'Email and Confirm Email do not match.'
    },
    email: {
      required: 'Email is required',
      emailDomain: 'Domain is invalid'
    },
    confEmail: {
      required: 'confEmail is required',
      emailDomain: 'Domain is invalid'
    },
    phone: {
      required: 'Phone is Erquired'
    },
    skillName: {
      required: 'Skill is Erquired'
    }
  };

  formErrors = {
    fullName: '',
    email: '',
    emailGroup: '',
    confEmail: '',
    phone: '',
    skillName: ''
  };

  constructor(private fb: FormBuilder, private activeRoute: ActivatedRoute,
    private empService: EmployeeService) { }

  ngOnInit(): void {

    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, CustomValidator.emailDomain('ricks.com')]],
        confEmail: ['', [Validators.required, CustomValidator.emailDomain('ricks.com')]]
      }, { validator: this.matchEmail }),
      phone: [''],
      contactPref: ['email'],
      skills: this.fb.array([
        this.addSkillGroup()
      ])

    });

    const formArray = new FormArray([
      new FormControl('Riki'),
      new FormGroup({
        name: new FormControl('Ricks'),
        age: new FormControl('28')
      }),
      new FormArray([
        new FormControl('phone'),
        new FormControl('email')
      ])

    ]);

    this.iterateForm(formArray);

    this.activeRoute.paramMap.subscribe((data) => {
      const id = +data.get('id');
      if (id) {
        const emp = this.empService.getEmpList().subscribe((data: Employee[]) => {
          const empData = data.find(a => a.Id === id);
          this.employee = empData;
          this.editEmployee(empData);
        }, error => { console.log(error); }
        );

      }
    });

    // console.log(formArray.value);

    // this.employeeForm = new FormGroup({
    //   fullName: new FormControl(),
    //   email: new FormControl(),
    //   skills: new FormGroup({
    //     skillName: new FormControl(),
    //     experiance: new FormControl(),
    //     proficiency: new FormControl()
    //   })
    // });

    // this.employeeForm.get('fullName').valueChanges.subscribe((value: string) => {
    //   console.log(value);
    // });

    this.employeeForm.valueChanges.subscribe((data: any) => {
      this.loadValidationMsj(this.employeeForm);
    });
    this.employeeForm.get('contactPref').valueChanges.subscribe((value: string) => {
      const phoneCtrl = this.employeeForm.get('phone');
      if (value === 'phone') {
        phoneCtrl.setValidators(Validators.required);
      }
      else {
        phoneCtrl.clearValidators();
      }
      phoneCtrl.updateValueAndValidity();
      this.loadValidationMsj(this.employeeForm);
    });
  }

  editEmployee(emp: Employee) {
    this.employeeForm.patchValue({
      fullName: emp.fullName,
      emailGroup: {
        email: emp.email,
        confEmail: emp.email
      },
      phone: emp.phone,
      contactPref: emp.contactPref
    });

    if (emp.skills.length > 0) {
      this.employeeForm.setControl('skills', this.setFormArrayValue(emp.skills));
    }
    const formArray = this.employeeForm.controls.skills;
    formArray.markAsTouched();
    formArray.markAsDirty();
  }
  setFormArrayValue(skills: Skills[]): FormArray {
    const formArray = new FormArray([]);
    skills.forEach(a => {
      const group = this.fb.group({
        skillName: a.skillName,
        experiance: a.experiance,
        proficiency: a.proficiency.toUpperCase()
      });
      formArray.push(group);
    });
    return formArray;
  }

  addSkillGroup() {
    return this.fb.group({
      skillName: ['', Validators.required],
      experiance: [''],
      proficiency: ['Noob'],
    });
  }

  addMoreSkill() {
    (this.employeeForm.get('skills') as FormArray).push(this.addSkillGroup());
  }

  removeSkill(index: number) {
    const skills = this.employeeForm.get('skills') as FormArray;
    skills.removeAt(index);
    skills.markAsTouched();
    skills.markAsDirty();
  }

  iterateForm(formArray: FormArray) {
    for (const ctrl of formArray.controls) {
      if (ctrl instanceof FormControl) {
        console.log(ctrl.value);
      }
      if (ctrl instanceof FormGroup) {
        Object.keys(ctrl.controls).forEach((key: string) => {
          console.log(ctrl.controls[key].value);
        });
      }
      if (ctrl instanceof FormArray) {
        this.iterateForm(ctrl);
      }

    }
  }

  emailDomain(domainName: string) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const email = control.value;
      const domain = email.substring(email.lastIndexOf('@') + 1);
      if (email === '' || domain.toLowerCase() === domainName.toLowerCase()) {
        return null;
      }
      else {
        return { emailDomain: true };
      }
    };
  }

  matchEmail(group: AbstractControl): { [key: string]: any } | null {

    const email = group.get('email')?.value;
    const confEmail = group.get('confEmail')?.value;
    if (email !== '' && (confEmail === '' || email === confEmail)) {
      return null;
    }
    else {
      return { emailMismatch: true };
    }
  }

  onSubmit() {
    debugger;

    if (this.employee) {
      this.employee.fullName = this.employeeForm.value.fullName;
      this.employee.email = 'riki@ricks.com';
      this.employee.phone = this.employeeForm.value.phone;
      this.empService.updateEmployee(this.employee).subscribe((data) => {

      });
    }
    else {
      this.employee = {
        Id: null,
        contactPref: 'email',
        fullName: this.employeeForm.value.fullName,
        email: this.employeeForm.value.email,
        phone: this.employeeForm.value.phone,
        skills: []
      };

      this.empService.addEmployee(this.employee).subscribe((data) => {

      });

    }


    this.loadValidationMsj(this.employeeForm);
    // console.log(this.employeeForm.controls.skills.get('skillName').value);
  }

  get form() {
    return this.employeeForm.controls;
  }

  loadData() {

    console.log(this.employeeForm.value);
    // this.employeeForm.setValue({
    //   fullName: 'Riki',
    //   email: 'Riki@df.com',
    //   skills: {
    //     skillName: '.net',
    //     experiance: 5,
    //     proficiency: 'Pro'
    //   }
    // });

    // this.employeeForm.patchValue({
    //   fullName: 'Riki',
    //   email: 'Riki@gmail.com'
    // });

    // this.loadValidationMsj(this.employeeForm);
  }

  loadValidationMsj(formGroup: FormGroup = this.employeeForm) {

    const empForm = formGroup;
    const list = Object.keys(empForm.controls);
    list.forEach((key: string) => {

      const absCtrl = empForm.get(key);
      // if (absCtrl instanceof FormGroup) {
      //   this.loadValidationMsj(absCtrl);
      // }
      // else
      // {

      this.formErrors[key] = '';
      if (absCtrl && (absCtrl.touched || absCtrl.dirty || absCtrl.value !== '') && !absCtrl.valid) {
        const msjs = this.validationMsjs[key];
        for (const errorKey in absCtrl.errors) {
          if (errorKey) {
            this.formErrors[key] += msjs[errorKey] + ' ';
          }
        }
      }

      if (absCtrl instanceof FormGroup) {
        this.loadValidationMsj(absCtrl);
      }

      if (absCtrl instanceof FormArray) {
        for (const ctrl of absCtrl.controls) {
          if (ctrl instanceof FormGroup) {
            this.loadValidationMsj(ctrl);
          }
        }
      }
      // console.log(`Key = ${key} and value = ${absCtrl.value}`);
      // }
      // absCtrl.disable(); // disable the contols
    });
  }

}
