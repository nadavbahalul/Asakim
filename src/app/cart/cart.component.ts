import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { CartService } from "./cart.service";
import { Router, RouterLink, RouterState } from "@angular/router";

@Component({
  selector: "cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"]
})
export class CartComponent implements OnInit, OnDestroy {
  private cartListener: Subscription;
  itemsInCart = [];
  totalPrice = 0;

  constructor(private cartService: CartService, private router: Router) {}

  async ngOnInit() {
    this.cartListener = this.cartService
      .getActiveCartListener()
      .subscribe(activeCart => {
        if (activeCart) {
          this.itemsInCart = Object.values(activeCart.items);
          this.updateTotalPrice();
        }
      });
    // this.cartService.getCart().then(cart => {
    //   if (cart) {
    //     this.itemsInCart = cart.items;
    //   }
    // });
  }

  updateTotalPrice() {
    this.totalPrice = 0;
    for (let item of this.itemsInCart) {
      this.totalPrice += item.amount * item.product.price;
    }

    this.totalPrice = Math.floor(this.totalPrice * 100) / 100;
  }

  ngOnDestroy() {
    this.cartListener.unsubscribe();
  }
  onCartClick($event: any) {
    $event.stopPropagation();
  }

  calcProductPrice(price, amount) {
    return Math.floor(price * amount * 100) / 100;
  }

  getMeasureUnitText(measureUnit) {
    this.cartService.getMeasureUnitText(measureUnit);
  }
}
