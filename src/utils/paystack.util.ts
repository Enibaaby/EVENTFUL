import axios from 'axios';
import { IPaystackInitializeResponse, IPaystackVerifyResponse } from '../interfaces/paystack.interface'; // <--- Updated Import

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export const initializePayment = async (
  email: string, 
  amount: number, 
  eventId: string, 
  userId: string
): Promise<IPaystackInitializeResponse> => { // <--- Added strict return type
  try {
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email,
        amount: amount * 100, 
        metadata: {
          eventId,
          userId,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.data; 
  } catch (error: any) {
    throw { statusCode: 400, message: `Paystack Error: ${error.response?.data?.message || error.message}` };
  }
};

export const verifyPayment = async (reference: string): Promise<IPaystackVerifyResponse> => { // <--- Added strict return type
  try {
    const response = await axios.get(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    throw { statusCode: 400, message: `Paystack Error: ${error.response?.data?.message || error.message}` };
  }
};