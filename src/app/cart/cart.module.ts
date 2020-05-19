import { Product } from "../create-product/createProduct.model";

export interface Cart {
  items: {
    product: Product;
    amount: number;
  }[];
  storeId: string;
}
