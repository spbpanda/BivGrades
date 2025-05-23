
import { SbiUserAddress } from "./address.model";
import { Document, DocumentExtraData } from "./document.model";
import { Gender } from "./user-profile.model";

export interface ResponseDetails<T> {
  data: T;
  error: unknown;
}

export interface UserDetailsInfo<T extends DocumentExtraData> {
  identityProvider: string;
  personalInfo: UserInfo;
  documents: Document<T>[];
  stsCountMax: number;
  profileImage: string;
  previewProfileImage: string;
  isAbleToChangePassword: boolean;
  hasPassword: boolean;
  passwordValidation: string[];
  passwordValidationRules: PasswordValidationRule[];
  protectionScale: [];
  generatePassword: boolean;
  profileFieldsInfo: FieldsInfo[];
}

export interface UserInfo {
  /**
   * СНИЛС
   */
  snils: string;
  /**
   * Имя
   */
  name: string;
  /**
   * Фамилия
   */
  surname: string;
  /**
   * Отчество
   */
  patronymic: string;
  /**
   * Дата рождения
   */
  birthdate: string;
  /**
   * Контактный телефон
   */
  phone: string;
  /**
   * Контактный e-mail
   */
  email: string;
  /**
   * Пол
   */
  gender: Gender;
  /**
   * Адрес регистрации
   */
  addressReg: SbiUserAddress;
  /**
   * Адрес проживания
   */
  addressActual: SbiUserAddress;
  /**
   * Совпадает с адресом проживания
   */
  actualResidenceAddressMatch: boolean;
  /**
   * Табельный номер сотрудника сбера
   */
  companyPersonnelNumber: string;
  /**
   * Сотрудник сбера
   */
  isCompanyEmployee: boolean;
}

export interface PasswordValidationRule {
  regex: string;
  message: string;
}

export interface FieldsInfo {
  fieldKey: string;
  modifiable: boolean;
  required: boolean;
}
