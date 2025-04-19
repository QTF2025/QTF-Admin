enum Gender {
    Male = '1',
    Female = '2',
    Others = '3',
}

enum VisaType {
    'H1',
    'L1',
    'H4',
    'L2',
    'F1',
    'F2',
    'J1',
    'J2',
}

enum YesNo {
    Yes = "1",
    No = "0"
}

enum MarriageStatus {
    Single = "1",
    Married = "2",
    Other = "3"
}

export interface IGeneralInfoData{
    first_name: string,
    middle_name: string,
    last_name: string,
    dob: Date | string,
    gender: Gender | string,
    ssn_itin: string | number,
    visa_type: VisaType | string,
    visa_change_in_2022: string,
    citizen_of_country: string,
    occupation: string,
    email: string,
    work_phone_number: string | number,
    primary_port_of_entry: Date | string,
    total_months_in_us: number | null,
    will_you_stayed_in_us: YesNo | string,
    mobile: string | number,
    zipcode: string | number,
    country: string,
    state: string,
    city: string ,
    street_address: string | number,
    apartment_number: string | number,
    marital_status: MarriageStatus | string,
    dependents: YesNo | string
}