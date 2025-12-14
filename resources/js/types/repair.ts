// Type definitions for Repair Management System

export interface Customer {
    id: number;
    name: string;
    phone: string | null;
    email: string | null;
    created_at: string;
    updated_at: string;
    repair_orders?: RepairOrder[];
}

export interface SparePart {
    id: number;
    name: string;
    stock_qty: number;
    unit_price: number;
    created_at: string;
    updated_at: string;
}

export interface RepairService {
    id: number;
    name: string;
    base_price: number;
    created_at: string;
    updated_at: string;
}

export interface RepairOrder {
    id: number;
    customer_id: number;
    status: 'pending' | 'in_progress' | 'completed';
    total_price: number;
    created_at: string;
    updated_at: string;
    customer?: Customer;
    services?: RepairOrderService[];
    payments?: Payment[];
}

export interface RepairOrderService {
    id: number;
    order_id: number;
    service_id: number;
    service_price: number;
    created_at: string;
    updated_at: string;
    service?: RepairService;
    parts?: RepairOrderPart[];
}

export interface RepairOrderPart {
    id: number;
    order_service_id: number;
    part_id: number;
    quantity: number;
    unit_price: number;
    created_at: string;
    updated_at: string;
    part?: SparePart;
}

export interface Payment {
    id: number;
    repair_order_id: number;
    amount: number;
    payment_method: 'cash' | 'card' | 'online';
    status: 'pending' | 'paid' | 'refunded';
    refund_amount?: number;
    refund_reason?: string;
    refunded_by?: number;
    refunded_at?: string;
    refunded_by_user?: {
        id: number;
        name: string;
    };
    created_at: string;
    updated_at: string;
    repair_order?: RepairOrder;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}
