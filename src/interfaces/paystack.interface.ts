export interface IPaystackInitializeResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface IPaystackVerifyResponse {
  status: string;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    gateway_response: string;
    paid_at: string;
    channel: string;
    currency: string;
    metadata: {
      eventId: string;
      userId: string;
    };
  };
}