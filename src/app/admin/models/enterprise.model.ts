export enum EnterpriseStatus {
  PENDING = 'PENDING',
  VALIDATED = 'VALIDATED',
  REJECTED = 'REJECTED',
}

export interface Enterprise {
  id: number;
  name: string;
  companyAddress: string;
  email: string;
  companyFax: string;
  investigatorName: string;
  investigatorPhone: string;
  investigatorEmail: string;
  status: EnterpriseStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface EnterpriseStatusUpdateDto {
  id: number;
  previousStatus: EnterpriseStatus;
  newStatus: EnterpriseStatus;
  notificationSent: boolean;
  message: string;
}

export interface EnterpriseDashboardDto {
  totalEnterprises: number;
  pendingEnterprises: number;
  validatedEnterprises: number;
  rejectedEnterprises: number;
}
