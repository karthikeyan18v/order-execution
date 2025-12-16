// All possible order states
export enum OrderStatus {
  PENDING = "pending",
  ROUTING = "routing",
  BUILDING = "building",
  SUBMITTED = "submitted",
  CONFIRMED = "confirmed",
  FAILED = "failed",
}

// Incoming order request
export interface CreateOrderRequest {
  fromToken: string;
  toToken: string;
  amount: number;
  slippage: number;
  idempotencyKey?: string;
}

// Internal order representation (active)
export interface ActiveOrder {
  orderId: string;
  status: OrderStatus;
  fromToken: string;
  toToken: string;
  amount: number;
  slippage: number;
  createdAt: string;
}
