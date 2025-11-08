import { useMutation } from '@tanstack/react-query';
import api from './index';


interface OrderItemDto {
  courseId: string;
  quantity: number;
}

interface PlaceOrderDto {
  items: OrderItemDto[];
  totalAmount: number;
  // Add other necessary fields for an order (e.g., shipping address, payment info)
}

interface OrderConfirmation {
  orderId: string;
  totalAmount: number;
  orderDate: string;
  // Add other confirmation details
}

const placeOrder = async (orderData: PlaceOrderDto): Promise<OrderConfirmation> => {
  // Simulate API call
  console.log("Placing order with data:", orderData);
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const usePlaceOrder = () => {
  return useMutation<OrderConfirmation, Error, PlaceOrderDto>({
    mutationFn: placeOrder,
  });
};

// Force re-evaluation of types