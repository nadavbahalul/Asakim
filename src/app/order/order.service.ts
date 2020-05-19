import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Product } from "../create-product/createProduct.model";
import { Cart } from "../cart/cart.module";

@Injectable({ providedIn: "root" })
export class OrderService {
  private API_URL = environment.apiURL;

  constructor(private http: HttpClient) {}

  order(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    adress: string,
    storeId: string,
    items: { product: Product; amount: number }[]
  ) {
    const cart: Cart = { items: items, storeId: storeId };

    const order = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      adress: adress,
      cart: cart
    };
    return this.http.post<{ message: string }>(this.API_URL + "/order", order);
  }
}
