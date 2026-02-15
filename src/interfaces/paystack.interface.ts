export interface IPaystackInitializeResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
  [key: string]: any;
}

export interface IPaystackVerifyResponse {
  id?: number;
  domain?: string;
  status?: string;
  reference?: string;
  amount?: number;
  gateway_response?: string;
  paid_at?: string;
  channel?: string;
  currency?: string;
  metadata: {
    eventId: string;
    userId: string;
  };
  [key: string]: any; // Prevents strict TS errors from missing Paystack fields
}