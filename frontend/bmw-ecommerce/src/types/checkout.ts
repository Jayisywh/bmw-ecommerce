export type CheckoutErrors = {
  fullName?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  paymentMethod?: string;
};

export type OrderSuccess = {
  orderId: string;
  transactionId: string;
  paymentMethod: string;
  totalPrice: number;
  orderStatus: string;
};
