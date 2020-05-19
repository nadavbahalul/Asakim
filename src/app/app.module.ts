import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { StoreComponent } from "./store/store.component";
import { AngularMaterialModule } from "./angular-material.module";
import { HeaderComponent } from "./header/header.component";
import { ProductComponent } from "./create-product/createProduct.component";
import { AppRoutingModule } from "./app-routing.module";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { AuthInterceptor } from "./auth/auth-interceptor";
import { ErrorInterceptor } from "./error-interceptor";
import { ErrorComponent } from "./error/error.component";
import { CartComponent } from "./cart/cart.component";
import { StoresComponent } from "./stores/stores.component";
import { InfoComponent } from "./info/info.component";
import { OrderSummaryComponent } from "./order/order.component";
import { CreateStoreComponent } from "./create-store/createStore.component";

@NgModule({
  declarations: [
    AppComponent,
    CreateStoreComponent,
    StoresComponent,
    StoreComponent,
    HeaderComponent,
    ProductComponent,
    ErrorComponent,
    CartComponent,
    InfoComponent,
    OrderSummaryComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
