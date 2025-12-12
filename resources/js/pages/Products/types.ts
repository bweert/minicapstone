export interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    category_id: number;
    categorie_name?: string;
    sku?: string;
    description?: string;
    image?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Category {
    id: number;
    categorie_name: string;
}
