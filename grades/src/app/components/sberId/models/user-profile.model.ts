import { SbiUserAddress } from "./address.model";

export interface UserProfileRequest {
  name: string;
  surname: string;
  patronymic: string;
  email: string;
  phone: string;
  gender: Gender;
  actualResidenceAddressMatch: boolean;
  addressReg: SbiUserAddress;
  addressActual: SbiUserAddress;
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export interface diffUserRequest {
  diffSubject: string;
  diffType: string;
  fields: diffUserFields[];
}

export interface diffUserFields {
  field: string;
  isPolicySensitive: boolean;
  suggestion: string;
}

export interface dataDiffUserFields extends Record<string, string | undefined> {
  name?: string;
  surname?: string;
  patronymic?: string;
  email?: string;
  phone?: string;
  birthdate?: string;
  issueDate?: string;
  series?: string;
  number?: string;
  departmentCode?: string;
  issuedBy?: string;
}
