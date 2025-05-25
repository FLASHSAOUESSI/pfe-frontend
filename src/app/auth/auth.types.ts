export interface RegisterRequest{
    companyName: string;
    companyAddress: string;
    companyEmail: string;
    companyFax: string;
    investigatorName: string;
    investigatorPhone: string;
    investigatorEmail: string;
    verificationCode?: string;
  }

export interface VerificationRequest {
    companyName: string;
    investigatorEmail: string;
    companyEmail: string;
}

export interface SetPasswordRequest {
    password: string;
    confirmPassword: string;
    token: string
}

export interface ForgetPasswordRequest{
  email:string;
}


export interface PasswordReset {
    email: string;
    newPassword: string;
  }