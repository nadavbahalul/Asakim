import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { Product } from "../create-product/createProduct.model";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductService } from "../create-product/createProduct.service";
import { CartService } from "../cart/cart.service";
import { Cart } from "../cart/cart.module";
import { Store } from "../stores/store.model";
import { StoreService } from "../stores/store.service";
import { MediaMatcher } from "@angular/cdk/layout";
import { AuthService } from "../auth/auth.service";
import { ErrorService } from "../error/error.service";

@Component({
  templateUrl: "./store.component.html",
  styleUrls: ["./store.component.css"]
})
export class StoreComponent implements OnInit {
  categories: { name: string; subCategories: string[] }[];
  subCategories: string;
  selectedCategory: string;
  selectedSubCategory: string;
  fetchedProducts: Product[];
  products: Product[];
  isStoreDataLoading = true;
  isProductsLoading = true;
  storeId: string;
  store: Store;
  isStoreOwner = false;
  colsOfStores;
  cart: Cart = { items: [], storeId: null };
  measureUnits = new Map<string, { text: string; minAmount: number }>([
    ["none", { text: "יח'", minAmount: 1 }],
    ["kg", { text: 'ק"ג', minAmount: 0.2 }],
    ["gram", { text: "גרם", minAmount: 0.2 }],
    ["liter", { text: "ליטר", minAmount: 1 }]
  ]);
  mediumMobileQuery: MediaQueryList;
  smallMobileQuery: MediaQueryList;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private storeService: StoreService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private errorService: ErrorService,
    private authService: AuthService
  ) {
    this.mediumMobileQuery = media.matchMedia("(max-width: 800px)");
    this.smallMobileQuery = media.matchMedia("(max-width: 400px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mediumMobileQuery.addListener(this._mobileQueryListener);
    this.smallMobileQuery.addListener(this._mobileQueryListener);
  }

  private _mobileQueryListener: () => void;

  ngOnInit() {
    this.errorService.getIsErrorListener().subscribe(() => {
      this.router.navigate(["/"]);
    });
    this.activateRoute.queryParamMap.subscribe(params => {
      this.storeId = params.get("id");
      this.loadStoreData();
      this.loadCartData();
    });
  }

  private loadCartData() {
    this.cartService.setActiveStoreId(this.storeId);
    this.cartService.getActiveCartListener().subscribe(activeCart => {
      if (!activeCart) {
        this.cart = { items: [], storeId: this.storeId };
      } else {
        this.cart = activeCart;
      }
    });
    this.cartService.getCart().then(cart => {
      if (cart) {
        this.cart = cart;
      } else {
        this.cart.storeId = this.storeId;
      }
    });
  }

  private loadStoreData() {
    this.cart.storeId = this.storeId;
    this.storeService.getStore(this.storeId).subscribe(response => {
      this.store = response.store;
      this.isStoreOwner = this.store.ownerId === this.authService.getUserId();
      this.isStoreDataLoading = false;
    });
    this.productService.getStoreProducts(this.storeId).subscribe(response => {
      if (response && response.products) {
        this.fetchedProducts = response.products;
        this.products = response.products;
        this.isProductsLoading = false;
      }
    });
  }

  onChangeCategory(selectedCategory) {
    this.selectedCategory = selectedCategory.category;
    this.selectedSubCategory = selectedCategory.subCategory;
    let temp = this.fetchedProducts.filter(product => {
      return (
        product.category === this.selectedCategory &&
        product.subCategory === this.selectedSubCategory
      );
    });
    this.products = [...temp];
  }

  getMeasureUnit(measureUnit) {
    if (this.measureUnits.get(measureUnit)) {
      return this.measureUnits.get(measureUnit).text;
    }

    return "";
  }

  onChangeAmount(product: Product, amount: number) {
    var newAmount =
      this.getAmount(product._id) +
      amount * this.measureUnits.get(product.measureUnit).minAmount;
    newAmount = Math.round(newAmount * 100) / 100;
    if (newAmount === 0) {
      if (this.cart.items[product._id]) {
        delete this.cart.items[product._id];
        this.cartService.getActiveCartListener().next(this.cart);
      }
    } else if (newAmount > 0) {
      if (!this.cart.items[product._id]) {
        this.cart.items[product._id] = { product: product, amount: newAmount };
      } else {
        this.cart.items[product._id].amount = newAmount;
      }
      this.cartService.getActiveCartListener().next(this.cart);
    }
  }

  getAmount(productId) {
    if (!this.cart || !this.cart.items[productId]) {
      return 0;
    }

    return this.cart.items[productId].amount;
  }
}
