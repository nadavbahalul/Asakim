import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CartService } from "../cart/cart.service";
import { OrderService } from "./order.service";
import { NgForm } from "@angular/forms";
import { Product } from "../create-product/createProduct.model";
import { MatDialog } from "@angular/material/dialog";
import { InfoComponent } from "../info/info.component";
import { Router } from "@angular/router";
import { MediaMatcher } from "@angular/cdk/layout";

@Component({
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.css"]
})
export class OrderSummaryComponent implements OnInit {
  itemsInCart: { product: Product; amount: number }[] = [];
  cartStoreId: string;
  totalPrice = 0;
  isLoading = false;
  mobileQuery: MediaQueryList;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private dialog: MatDialog,
    private router: Router,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia("(max-width: 600px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  private _mobileQueryListener: () => void;

  ngOnInit() {
    this.cartService.getCart().then(cart => {
      if (cart) {
        this.itemsInCart = Object.values(cart.items);
        this.cartStoreId = cart.storeId;
        this.calcTotalPrice();
      }
    });
    this.cartService.getActiveCartListener().subscribe(cart => {
      this.itemsInCart = Object.values(cart.items);
      this.cartStoreId = cart.storeId;
      this.calcTotalPrice();
    });
  }

  calcTotalPrice() {
    let totalPrice = 0;
    for (let item of this.itemsInCart) {
      totalPrice += item.amount * item.product.price;
    }

    this.totalPrice = totalPrice;
  }

  getMeasureUnitText(measureUnit) {
    this.cartService.getMeasureUnitText(measureUnit);
  }

  calcProductPrice(price, amount) {
    return Math.floor(price * amount * 100) / 100;
  }

  onOrder(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    this.orderService
      .order(
        form.value.firstName,
        form.value.lastName,
        form.value.email,
        form.value.phone,
        form.value.adress,
        this.cartStoreId,
        this.itemsInCart
      )
      .subscribe(response => {
        this.isLoading = false;
        if (response) {
          this.dialog.open(InfoComponent, {
            data: {
              messageHeader: "ההזמנה נשלחה למוכר",
              messageBody:
                "אישור ההזמנה נמצא במייל שלכם, המוכר ייצור אתכם קשר בקרוב"
            }
          });
        }

        this.cartService.emptyCart(this.cartStoreId);
        this.router.navigate(["/"]);
      });
  }
}
