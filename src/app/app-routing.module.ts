import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { StoreComponent } from "./store/store.component";
import { ProductComponent } from "./create-product/createProduct.component";
import { AuthGuard } from "./auth/auth.guard";
import { StoresComponent } from "./stores/stores.component";
import { OrderSummaryComponent } from "./order/order.component";
import { CreateStoreComponent } from "./create-store/createStore.component";

const routes: Routes = [
  { path: "", component: StoresComponent },
  { path: "store", component: StoreComponent },
  {
    path: "newStore",
    component: CreateStoreComponent,
    canActivate: [AuthGuard]
  },
  { path: "product", component: ProductComponent, canActivate: [AuthGuard] },
  {
    path: "product/:id",
    component: ProductComponent,
    canActivate: [AuthGuard]
  },
  { path: "order", component: OrderSummaryComponent },
  {
    path: "auth",
    loadChildren: () => import("./auth/auth.module").then(m => m.AuthModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
