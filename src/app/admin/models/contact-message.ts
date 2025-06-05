export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: Date;
  responded: boolean;
  adminResponse: string | null;
  responseTimestamp: Date | null;
}
