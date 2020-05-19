import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { StoreService } from "./store.service";
import { Store } from "./store.model";
import { MediaMatcher } from "@angular/cdk/layout";
import { CategoriesService } from "../category/category.service";
import { AuthService } from "../auth/auth.service";
import * as queryString from "query-string";

@Component({
  templateUrl: "./stores.component.html",
  styleUrls: ["./stores.component.css"]
})
export class StoresComponent implements OnInit {
  isLoading = false;
  stores: Store[];
  filteredStores: Store[];
  mobileQuery: MediaQueryList;
  isAuth: boolean;

  constructor(
    private storeService: StoreService,
    private categoriesService: CategoriesService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private authService: AuthService
  ) {
    this.mobileQuery = media.matchMedia("(max-width: 600px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  private _mobileQueryListener: () => void;

  ngOnDestroy() {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.getGoogleCode();
    this.isLoading = true;
    this.isAuth = this.authService.getIsAuth();
    this.authService.getAuthStatusListener().subscribe(isAuth => {
      this.isAuth = isAuth;
    });
    this.storeService.getStores().subscribe(response => {
      this.stores = [...response.stores];
      this.filteredStores = this.stores;
      this.isLoading = false;
    });
    this.categoriesService.getChosenCategoryListener().subscribe(category => {
      if (!category || category.length === 0) {
        this.filteredStores = [...this.stores];
      } else {
        this.filteredStores = [
          ...this.stores.filter(store => {
            return store.category === category;
          })
        ];
      }
    });
  }

  getGoogleCode() {
    const urlParams = queryString.parse(window.location.search);
    if (urlParams.error) {
      console.log(`An error occurred: ${urlParams.error}`);
    } else if (urlParams.code) {
      console.log(`The code is: ${urlParams.code}`);
      this.authService.sendGoogleCode(urlParams.code);
    }
  }
}
