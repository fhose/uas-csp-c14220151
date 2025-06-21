export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
}

export interface Order {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  order_date: string;
  product: {
    name: string;
    price: number;
    image?: string;
  } | null;
}


