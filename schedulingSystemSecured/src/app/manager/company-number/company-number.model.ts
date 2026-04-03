export interface CompanyNumberRequest {
  companyNumber: string;
  phoneNumberId: string;    // Phone Number Identifier de Meta
  accessToken: string;      // Access Token permanente
  wabaId: string;           // WhatsApp Business Account ID
  verifyToken: string;      // El token de verificación
}

export interface CompanyNumberResponse {
  companyNumber: string;
  phoneNumberId: string;
  accessToken: string;
  wabaId: string;
  verifyToken: string;
}