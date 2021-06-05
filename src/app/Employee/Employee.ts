export class Employee {
    Id: number;
    fullName: string;
    contactPref: string;
    email: string;
    phone: string;
    skills: Skills[];
}

export class Skills{
    skillName: string;
    experiance: number;
    proficiency: string;
}
