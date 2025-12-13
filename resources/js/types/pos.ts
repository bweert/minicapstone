// POS System TypeScript Interfaces

export interface Category {
    id: number;
    categorie_name: string;
    products_count?: number;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: number;
    name: string;
    category_id: number;
    category?: Category;
    SKU: string;
    price: number;
    cost: number;
    stock_quantity: number;
    image?: string;
    created_at: string;
    updated_at: string;
}

export interface TransactionItem {
    id: number;
    transaction_id: number;
    product_id: number;
    product?: Product;
    quantity: number;
    price: number;
    subtotal: number;
    created_at: string;
    updated_at: string;
}

export interface Transaction {
    id: number;
    reference_number: string;
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    payment_method: 'cash' | 'gcash';
    amount_received?: number;
    change?: number;
    gcash_reference?: string;
    completed_at?: string;
    items?: TransactionItem[];
    created_at: string;
    updated_at: string;
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

export interface CategoryStats {
    total: number;
    with_products: number;
    empty: number;
}

export interface ProductStats {
    total: number;
    total_value: number;
    low_stock: number;
    out_of_stock: number;
}

export interface TransactionStats {
    total_transactions: number;
    total_revenue: number;
    cash_transactions: number;
    gcash_transactions: number;
    today_revenue: number;
    today_transactions: number;
}
