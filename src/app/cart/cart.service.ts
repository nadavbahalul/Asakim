import { Injectable } from "@angular/core";
import { Cart } from "../cart/cart.module";
import { Subject } from "rxjs";
import { ProductService } from "../create-product/createProduct.service";

@Injectable({ providedIn: "root" })
export class CartService {
  private carts: Cart[] = [];
  private isPrevCartsLoaded: [boolean] = [false];
  private activeStoreId: string;
  private activeCartListener = new Subject<Cart>();
  measureUnits = new Map<string, { text: string; minAmount: number }>([
    ["none", { text: "יחידות", minAmount: 1 }],
    ["kg", { text: 'ק"ג', minAmount: 0.2 }],
    ["gram", { text: "גרם", minAmount: 0.2 }],
    ["liter", { text: "ליטר", minAmount: 1 }]
  ]);

  constructor(private productService: ProductService) {
    this.activeCartListener.subscribe(activeCart => {
      if (activeCart) {
        this.storeCartInLocalStorage(activeCart);
        this.carts[this.activeStoreId] = activeCart;
      }
    });
  }

  setActiveStoreId(id: string) {
    this.activeStoreId = id;
    localStorage.setItem("storeId", this.activeStoreId);
    if (this.isPrevCartsLoaded[this.activeStoreId]) {
      if (!this.carts[this.activeStoreId]) {
        this.carts[this.activeStoreId] = {
          items: [],
          storeId: this.activeStoreId
        };
      }
      this.activeCartListener.next(this.carts[this.activeStoreId]);
    }
  }

  private storeCartInLocalStorage(cartToStore: Cart) {
    let tempProductsArr = [];
    let tempAmountsArr = [];

    for (let item of Object.values(cartToStore.items)) {
      if (item.amount > 0) {
        tempProductsArr.push(item.product._id);
        tempAmountsArr.push(item.amount);
      }
    }

    localStorage.setItem(
      "productsInCart_" + this.activeStoreId,
      JSON.stringify(tempProductsArr)
    );
    localStorage.setItem(
      "productsAmounts_" + this.activeStoreId,
      JSON.stringify(tempAmountsArr)
    );
  }

  async getCart(): Promise<Cart> {
    if (!this.activeStoreId) {
      this.activeStoreId = localStorage.getItem("storeId");
    }

    if (this.carts[this.activeStoreId]) {
      return Promise.resolve(this.carts[this.activeStoreId]);
    } else {
      let cart: Cart = { items: [], storeId: this.activeStoreId };
      let { products, amounts } = this.loadCartFromLocalStorage(
        this.activeStoreId
      );
      if (products && amounts && products.length && amounts.length) {
        await this.productService
          .getProductsByIDs(products)
          .subscribe(response => {
            if (response && response.products) {
              for (let i = 0; i < response.products.length; i++) {
                cart.items[response.products[i]._id] = {
                  product: response.products[i],
                  amount: Number.parseInt(amounts[i])
                };
              }

              this.isPrevCartsLoaded[this.activeStoreId] = true;
              this.carts[this.activeStoreId] = cart;
              this.activeCartListener.next(this.carts[this.activeStoreId]);
              return Promise.resolve(cart);
            }
          });
      }
    }
  }

  private loadCartFromLocalStorage(
    storeId
  ): { products: [string]; amounts: [string] } {
    let productsInCart = JSON.parse(
      localStorage.getItem("productsInCart_" + storeId)
    );
    let productsAmounts = JSON.parse(
      localStorage.getItem("productsAmounts_" + storeId)
    );
    return { products: productsInCart, amounts: productsAmounts };
  }

  getMeasureUnitText(measureUnit) {
    if (!this.measureUnits.get(measureUnit)) return "";
    return this.measureUnits.get(measureUnit).text;
  }

  getActiveCartListener() {
    return this.activeCartListener;
  }

  emptyCart(storeId: string) {
    this.carts[storeId] = { items: [], storeId: storeId };
    this.activeCartListener.next(this.carts[storeId]);
  }
}
