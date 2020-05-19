import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";
import { CategoriesService } from "../category/category.service";
import { CartService } from "../cart/cart.service";
import { MediaMatcher } from "@angular/cdk/layout";
import { Router, NavigationEnd } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  categories: string[];
  private authStatusListener: Subscription;
  private cartServiceListener: Subscription;
  public isAuthorize = false;
  showCart: boolean;
  mobileQuery: MediaQueryList;
  showCategories = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private categoriesService: CategoriesService,
    private cartService: CartService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia("(max-width: 1100px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  private _mobileQueryListener: () => void;

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showCategories = event.url === "/";
      }
    });
    this.isAuthorize = this.authService.getIsAuth();
    this.showCart = this.cartService.getCart() !== null;
    this.cartServiceListener = this.cartService
      .getActiveCartListener()
      .subscribe(cart => {
        this.showCart = cart !== null;
      });
    this.authStatusListener = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthorize => {
        this.isAuthorize = isAuthorize;
      });
    this.categoriesService.getCategories().subscribe(response => {
      this.categories = response.categories.categories;
    });
  }

  ngOnDestroy() {
    this.authStatusListener.unsubscribe();
    this.cartServiceListener.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }

  onCatClick(category: string) {
    this.categoriesService.getChosenCategoryListener().next(category);
  }

  onLogoClick() {
    this.categoriesService.getChosenCategoryListener().next();
    this.router.navigate(["/"]);
  }
}
