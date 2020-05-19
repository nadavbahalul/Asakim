import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Product } from "./createProduct.model";

@Injectable({ providedIn: "root" })
export class ProductService {
  private API_URL = environment.apiURL;
  measureUnits: JSON;

  constructor(private http: HttpClient) {}

  createProduct(
    name: string,
    content: string,
    image: File,
    price: string,
    measureUnit: string,
    userId: string
  ) {
    const productData = new FormData();
    productData.append("content", content);
    productData.append("image", image, name);
    productData.append("name", name);
    productData.append("price", price);
    productData.append("measureUnit", measureUnit);
    productData.append("userId", userId);
    return this.http.post<{ message: string }>(
      this.API_URL + "/product",
      productData
    );
  }

  updateProduct(
    id: string,
    name: string,
    content: string,
    image: File,
    price: string,
    measureUnit: string,
    userId: string
  ) {
    const productData = new FormData();
    productData.append("id", id);
    productData.append("name", name);
    productData.append("content", content);
    if (typeof image === "string") {
      productData.append("imagePath", image);
    } else {
      productData.append("image", image, name);
    }
    productData.append("price", price);
    productData.append("measureUnit", measureUnit);
    productData.append("userId", userId);
    return this.http.post<{ message: string }>(
      this.API_URL + "/product/update",
      productData
    );
  }

  getProducts() {
    return this.http.get<{ products: Product[] }>(this.API_URL + "/product");
  }

  getProduct(id: string) {
    return this.http.get<{ product: Product }>(this.API_URL + "/product/" + id);
  }

  getProductsByIDs(productsIDs: [string]) {
    return this.http.post<{ products: Product[] }>(
      this.API_URL + "/products/ids",
      { ids: productsIDs }
    );
  }

  getStoreProducts(storeId) {
    return this.http.get<{ products: Product[] }>(
      this.API_URL + "/store/products/" + storeId
    );
  }

  getMeasureUnits() {
    if (this.measureUnits) {
      return this.measureUnits;
    } else {
      this.http
        .get<{ measureUnits: JSON }>(this.API_URL + "/product/measureUnits")
        .subscribe(response => {
          this.measureUnits = response.measureUnits;
          return this.measureUnits;
        });
    }
  }
}
