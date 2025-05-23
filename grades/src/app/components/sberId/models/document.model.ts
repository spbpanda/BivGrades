export interface Document<T extends DocumentExtraData> {
  id: number | null;
  type: string;
  series: string;
  number: string;
  issueDate?: string | null;
  extraData: T;
}

export interface DocumentExtraData {
  birthdate: string | null;
  departmentCode: string | null;
  issuedBy: string;
  passportType: string;
}
